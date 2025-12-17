resource "aws_elasticache_replication_group" "replication_group" {
  replication_group_id    = "${var.project}-replication-group"
  description             = "ElastiCache with ${var.project}-replication-group"
  subnet_group_name       = var.aws_elasticache_subnet_group.name
  security_group_ids      = var.security_group_ids
  num_node_groups         = 2
  replicas_per_node_group = 1

  node_type            = "cache.t3.micro"
  engine_version       = "6.x"
  parameter_group_name = "default.redis6.x.cluster.on"

  auto_minor_version_upgrade = true
  automatic_failover_enabled = true
  multi_az_enabled           = true
  apply_immediately          = true
  port                       = 6379
  maintenance_window         = "sun:16:00-sun:17:00"
  snapshot_window            = "17:01-18:01"
  snapshot_retention_limit   = 5

  tags = {
    Name = "${var.project}-replication-group"
  }
}
