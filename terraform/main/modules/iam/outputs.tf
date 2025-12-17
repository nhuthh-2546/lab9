output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions"
  value       = var.enable_github_actions_oidc ? aws_iam_role.github_actions[0].arn : null
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC provider"
  value       = var.enable_github_actions_oidc ? aws_iam_openid_connect_provider.github_actions[0].arn : null
}

output "iam_role_arns" {
  description = "Map of IAM Role ARNs"
  value       = { for k, v in aws_iam_role.iam_role : k => v.arn }
}

output "iam_role_names" {
  description = "Map of IAM Role names"
  value       = { for k, v in aws_iam_role.iam_role : k => v.name }
}

output "iam_instance_profile_ids" {
  description = "Map of Instance Profile IDs"
  value       = { for k, v in aws_iam_instance_profile.iam_instance_profile : k => v.id }
}

output "iam_instance_profile_arns" {
  description = "Map of Instance Profile ARNs"
  value       = { for k, v in aws_iam_instance_profile.iam_instance_profile : k => v.arn }
}
