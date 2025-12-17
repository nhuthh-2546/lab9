provider "aws" {
  region = "ap-southeast-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.16.0"
    }
  }

  backend "s3" {
    bucket  = "nhut-learning-tf-s3-backend-20251216-021925"
    key     = "learning"
    region  = "ap-southeast-1"
    encrypt = true
    # kms_key_id     = "arn:aws:kms:ap-southeast-1:005570540694:key/36a7b6e5-3c11-407f-adc7-32b851143628"
    dynamodb_table = "nhut-learning-tf-s3-backend"
  }
}

locals {
  tags = {
    project = var.project
  }
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

module "redis" {
  source = "./modules/redis"

  project                      = local.tags.project
  aws_elasticache_subnet_group = module.networking.network.aws_elasticache_subnet_group
  security_group_ids           = [module.networking.sg.redis]
}

module "database" {
  source = "./modules/database"

  project   = local.tags.project
  network   = module.networking.network
  sg        = module.networking.sg
  db_subnet = module.networking.network.db_subnet_group
}
