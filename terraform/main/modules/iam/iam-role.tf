resource "aws_iam_role" "iam_role" {
  for_each = var.iam_roles != null ? { for role in var.iam_roles : role.name => role } : {}

  name               = "${var.project}-${each.value.name}-role"
  description        = "${var.project} : ${each.value.service}"
  assume_role_policy = each.value.assume_role_policy

  tags = {
    Service = each.value.service
    Project = var.project
  }
}

resource "aws_iam_role_policy_attachment" "iam_default_policy" {
  for_each = var.iam_roles != null ? {
    for pair in flatten([
      for role in var.iam_roles : [
        for idx, policy_arn in coalesce(role.default_policy_arns, []) : {
          key        = "${role.name}-${idx}"
          role_name  = role.name
          policy_arn = policy_arn
        }
      ]
    ]) : pair.key => pair
  } : {}

  role       = aws_iam_role.iam_role[each.value.role_name].name
  policy_arn = each.value.policy_arn
}

resource "aws_iam_role_policy" "iam_custom_policy" {
  for_each = var.iam_roles != null ? {
    for role in var.iam_roles : role.name => role if role.custom_policy != null
  } : {}

  name   = "${var.project}-${each.key}-policy"
  role   = aws_iam_role.iam_role[each.key].id
  policy = each.value.custom_policy
}

resource "aws_iam_instance_profile" "iam_instance_profile" {
  for_each = var.iam_roles != null ? {
    for role in var.iam_roles : role.name => role if role.create_instance_profile == true
  } : {}

  name = "${var.project}-${each.key}-instance-profile"
  role = aws_iam_role.iam_role[each.key].name
}
