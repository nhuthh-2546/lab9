variable "project" {
  description = "Name of project"
  type        = string
}
variable "ecr" {
  description = "All configuration to Provides an Elastic Container Registry Repository."
  type = object({
    name                 = string
    image_tag_mutability = optional(string, "MUTABLE")
    scan_on_push         = optional(bool, false)
  })
}
variable "ecr_lifecycle_policy" {
  description = "Lifecycle policy for ECR repository"
  type        = string
}
