output "network" {
  value = {
    vpc = aws_vpc.vpc
    public_subnets = aws_subnet.public_subnet[*].id
    private_subnets = aws_subnet.private_subnet[*].id
    db_subnets = aws_subnet.database_subnet[*].id
    db_subnet_group = aws_db_subnet_group.db_subnet
    aws_elasticache_subnet_group = aws_elasticache_subnet_group.redis_subnet
  }
}

output "sg" {
  value = {
    alb = aws_security_group.alb_sg.id
    backend = aws_security_group.web_sg.id
    db = aws_security_group.db_sg.id
    redis = aws_security_group.redis_sg.id
  }
}
