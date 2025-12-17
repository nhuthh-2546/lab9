variable "project" {
  description = "Project name for resource naming"
  type        = string
}

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
  default     = null
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = null
}

variable "enable_github_actions_oidc" {
  description = "Enable GitHub Actions OIDC provider and role"
  type        = bool
  default     = false
}

variable "iam_roles" {
  description = "List of IAM roles to create"
  type = list(object({
    name                    = string
    service                 = string
    assume_role_policy      = string
    default_policy_arns     = optional(list(string), [])
    custom_policy           = optional(string, null)
    create_instance_profile = optional(bool, false)
  }))
  default = null
}
