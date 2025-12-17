resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name = var.project
  }
}

resource "aws_subnet" "public_subnet" {
  count = length(var.public_subnet_cidrs)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = {
    Name = "${var.project}-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet" {
  count = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = {
    Name = "${var.project}-private-${count.index + 1}"
  }
}

resource "aws_subnet" "database_subnet" {
  count = length(var.database_subnet_cidrs)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = {
    Name = "${var.project}-database-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "ig" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.project}-ig"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig.id
  }

  tags = {
    Name = "${var.project}-public"
  }
}

resource "aws_route_table_association" "pubic" {
  for_each = { for k,v in aws_subnet.public_subnet : k => v}
  subnet_id = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat" {
  domain   = "vpc"
}

resource "aws_nat_gateway" "private" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public_subnet[0].id
  depends_on = [ aws_internet_gateway.ig ]

  tags  = {
    Name = "NAT"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.private.id
  }
}

resource "aws_route_table_association" "private" {
  for_each = { for k,v in aws_subnet.private_subnet : k => v}
  subnet_id = each.value.id
  route_table_id = aws_route_table.private.id
}

resource "aws_db_subnet_group" "db_subnet" {
  name       = "${var.project}-db-subnet"
  subnet_ids = aws_subnet.database_subnet[*].id

  tags = {
    Name = "${var.project}-db-subnet"
  }
}

resource "aws_elasticache_subnet_group" "redis_subnet" {
  name = "${var.project}-redis-subnet"
  subnet_ids = aws_subnet.database_subnet[*].id

  tags = {
    Name = "${var.project}-redis-subnet"
  }
}

resource "aws_security_group" "alb_sg" {
  vpc_id = aws_vpc.vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "web_sg" {
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "db_sg" {
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "redis_sg" {
  vpc_id      = aws_vpc.vpc.id
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

   egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}
