output "db_password" {
  value     = module.database.config.password
  sensitive = true
}

output "ecr_repository_url" {
  description = "ECR repository URL for the backend"
  value       = module.ecr.ecr_repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = module.ecr.ecr_name
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.alb.alb_arn
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs.ecs_cluster_arn
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.ecs_service_name
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = module.ecs.ecs_task_definition_arn
}

output "backend_url" {
  description = "URL to access the backend application"
  value       = "http://${module.alb.alb_dns_name}"
}

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions OIDC"
  value       = module.iam.github_actions_role_arn
}

output "github_actions_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider"
  value       = module.iam.oidc_provider_arn
}