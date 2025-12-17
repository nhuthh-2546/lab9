#modules/redis/_outputs.tf
output "primary_endpoint_address" {
  value       = aws_elasticache_replication_group.replication_group.primary_endpoint_address
}

output "member_clusters" {
  value       = tolist(aws_elasticache_replication_group.replication_group.*.member_clusters[0])
}

output "replication_group_id" {
  value       = aws_elasticache_replication_group.replication_group.id
}

output "configuration_endpoint_address" {
  value       = aws_elasticache_replication_group.replication_group.configuration_endpoint_address
}
