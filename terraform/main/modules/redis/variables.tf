variable "project" {
  type = string
}

variable "aws_elasticache_subnet_group" {
  type = any
}

variable "security_group_ids" {
  type        = list(string)
}
