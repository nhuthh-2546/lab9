provider "aws" {
  region = "ap-southeast-1"
}

terraform {
  backend "s3" {
    bucket         = "nhut-learning-tf-s3-backend-20251219-091316"
    key            = "learning"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "nhut-learning-tf-s3-backend"
  }
}

locals {
  tags = {
    project = var.project
  }
  region = "ap-southeast-1"
}

resource "aws_cloudwatch_log_group" "ecs_backend" {
  name              = "/ecs/${var.project}-backend"
  retention_in_days = 30

  tags = {
    Name    = "${var.project}-backend-logs"
    Project = var.project
  }
}

module "iam" {
  source = "./modules/iam"

  project = local.tags.project

  enable_github_actions_oidc = true
  github_org                 = var.github_org
  github_repo                = var.github_repo

  iam_roles = [
    {
      name    = "ecs-execution"
      service = "ecs-tasks"
      assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
        }]
      })
      default_policy_arns = [
        "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
      ]
    },
    {
      name    = "ecs-task"
      service = "ecs-tasks"
      assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
        }]
      })
    }
  ]
}

module "networking" {
  source = "./modules/networking"

  project               = local.tags.project
  vpc_cidr              = "10.0.0.0/16"
  private_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnet_cidrs   = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  database_subnet_cidrs = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]
  availability_zones    = ["ap-southeast-1a", "ap-southeast-1b", "ap-southeast-1c"]
}

module "database" {
  source = "./modules/database"

  project   = local.tags.project
  network   = module.networking.network
  sg        = module.networking.sg
  db_subnet = module.networking.network.db_subnet_group
}

module "ecr" {
  source = "./modules/ecr"

  project = local.tags.project

  ecr = {
    name         = "api"
    scan_on_push = true
  }

  ecr_lifecycle_policy = jsonencode(
    {
      "rules" : [
        {
          "rulePriority" : 10,
          "description" : "Keep last 5 images untagged",
          "selection" : {
            "tagStatus" : "untagged",
            "countType" : "imageCountMoreThan",
            "countNumber" : 5
          },
          "action" : {
            "type" : "expire"
          }
        },
        {
          "rulePriority" : 20,
          "description" : "Keep last 5 images tagged",
          "selection" : {
            "tagStatus" : "tagged",
            "tagPrefixList" : [
              var.project
            ],
            "countType" : "imageCountMoreThan",
            "countNumber" : 5
          },
          "action" : {
            "type" : "expire"
          }
        },
        {
          "rulePriority" : 30,
          "description" : "Keep last 40 images any",
          "selection" : {
            "tagStatus" : "any",
            "countType" : "imageCountMoreThan",
            "countNumber" : 40
          },
          "action" : {
            "type" : "expire"
          }
        }
      ]
    }
  )
}

module "alb" {
  source = "./modules/alb"

  project = local.tags.project
  type    = "api"

  alb = {
    security_groups_id = [module.networking.sg.alb]
    subnets_id         = module.networking.network.public_subnets
    logs_bucket_id     = aws_s3_bucket.alb_logs.id
  }

  alb_target_group = {
    vpc_id = module.networking.network.vpc.id
    target_groups = [
      {
        name                 = "blue"
        target_type          = "ip"
        port                 = 3000
        deregistration_delay = 60
        health_check = {
          port                = 3000
          path                = "/up"
          unhealthy_threshold = 3
          interval            = 30
          timeout             = 20
        }
      },
      {
        name        = "green"
        target_type = "ip"
        port        = 3000
        health_check = {
          port                = 3000
          path                = "/up"
          unhealthy_threshold = 3
          interval            = 30
          timeout             = 20
        }
      }
    ]
  }
  alb_listeners = [
    {
      port     = "80"
      protocol = "HTTP"
      default_action = {
        type = "forward"
        forward = {
          target_group_arn = null
        }
      }
    }
  ]
}

resource "aws_s3_bucket" "alb_logs" {
  bucket = "${var.project}-alb-logs"

  tags = {
    Name    = "${var.project}-alb-logs"
    Project = var.project
  }
}

data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = data.aws_elb_service_account.main.arn
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/*"
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.alb_logs.arn
      }
    ]
  })
}

module "ecs" {
  source = "./modules/ecs"

  project          = local.tags.project
  ecs_cluster_name = "main"
  ecs_cluster_id   = null

  ecs_task_definition = {
    execution_role_arn = module.iam.iam_role_arns["ecs-execution"]
    task_definitions = [
      {
        name          = "backend"
        total_memory  = 512
        total_cpu     = 256
        task_role_arn = module.iam.iam_role_arns["ecs-task"]
        container_definitions = {
          template = "${path.module}/modules/ecs/templates/backend.json"
          vars = {
            container_name = "backend"
            image          = "${module.ecr.ecr_repository_url}:latest"
            container_port = 3000
            rails_env      = "production"
            database_url   = "postgres://${module.database.config.user}:${module.database.config.password}@${module.database.config.hostname}:${module.database.config.port}/${module.database.config.database}"
            log_group      = aws_cloudwatch_log_group.ecs_backend.name
            aws_region     = local.region
            memory         = 512
            cpu            = 256
          }
        }
      }
    ]
  }

  ecs_services = [
    {
      name                = "backend"
      task_definition_arn = null
      desired_count       = 2
      security_groups_id  = [module.networking.sg.backend]
      subnets_id          = module.networking.network.private_subnets
      load_balancer = {
        target_group_arn = module.alb.alb_target_group_arn["blue"]
        container_name   = "backend"
        container_port   = 3000
      }
    }
  ]

  depends_on = [module.alb, module.ecr]
}