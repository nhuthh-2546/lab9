output "ecs_cluster_id" {
  value = aws_ecs_cluster.ecs_cluster[0].id
}
output "ecs_cluster_arn" {
  value = aws_ecs_cluster.ecs_cluster[0].arn
}
output "ecs_cluster_name" {
  value = aws_ecs_cluster.ecs_cluster[0].name
}

output "ecs_service_name" {
  value = { for key, value in aws_ecs_service.ecs_service : key => value.name }
}
output "ecs_service_arn" {
  value = values(aws_ecs_service.ecs_service)[*].id
}

output "ecs_task_definition_arn" {
  value = { for key, value in aws_ecs_task_definition.ecs_task_definition : key => value.arn }
}
output "ecs_task_definition_family" {
  value = { for key, value in aws_ecs_task_definition.ecs_task_definition : key => value.family }
}
