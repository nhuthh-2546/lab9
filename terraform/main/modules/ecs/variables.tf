variable "project" {
  type = string
}

variable "ecs_cluster_name" {
  type = string
}
variable "ecs_cluster_id" {
  type = string
}

variable "ecs_services" {
  type = list(object({
    name                               = string
    task_definition_arn                = string
    desired_count                      = number
    security_groups_id                 = list(string)
    subnets_id                         = list(string)
    platform_version                   = optional(string, "1.4.0")
    deployment_minimum_healthy_percent = optional(number, 100)
    deployment_maximum_percent         = optional(number, 200)
    deployment_controller              = optional(string, "ECS")
    load_balancer = optional(object({
      target_group_arn                  = string
      container_name                    = string
      container_port                    = number
      health_check_grace_period_seconds = optional(number, 120)
    }), null)
  }))
}

variable "ecs_task_definition" {
  type = object({
    execution_role_arn = string
    task_definitions = list(object({
      name          = string
      total_memory  = number
      total_cpu     = number
      task_role_arn = string
      container_definitions = object({
        template = string
        vars     = optional(map(any), null)
      })
    }))
  })
}
