resource "aws_lb_listener" "alb_listener" {
  for_each = { for value in var.alb_listeners : value.port => value }

  load_balancer_arn = aws_lb.alb.arn
  port              = each.value.port
  protocol          = each.value.protocol
  ssl_policy        = each.value.ssl_policy
  certificate_arn   = each.value.certificate_arn

  dynamic "default_action" {
    for_each = each.value.default_action.type == "redirect" ? [1] : []
    content {
      type = "redirect"
      redirect {
        port        = each.value.default_action.redirect.port
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }

  dynamic "default_action" {
    for_each = each.value.default_action.type == "forward" ? [1] : []
    content {
      type             = "forward"
      target_group_arn = each.value.default_action.forward.target_group_arn != null ? each.value.default_action.forward.target_group_arn : aws_lb_target_group.alb_target_group[var.alb_target_group.target_groups[0].name].arn
    }
  }

  dynamic "default_action" {
    for_each = each.value.default_action.type == "forward_weight" ? [1] : []
    content {
      type = "forward"
      target_group_arn = each.value.default_action.forward.target_group_arn
      forward {
        dynamic "target_group" {
          for_each = each.value.default_action.target_groups
          content {
            arn    = target_group.value.target_group_arn
            weight = target_group.value.target_group_weight
          }
        }
        dynamic "stickiness" {
          for_each = each.value.default_action.stickiness != {} ? [1] : []
          content {
            duration = each.value.default_action.stickiness.duration
            enabled  = each.value.default_action.stickiness.enabled
          }
        }
      }
    }
  }

  dynamic "default_action" {
    for_each = each.value.default_action.type == "fixed-response" ? [1] : []
    content {
      type = "fixed-response"
      fixed_response {
        content_type = each.value.default_action.fixed_response.content_type
        status_code  = each.value.default_action.fixed_response.status_code
        message_body = each.value.default_action.fixed_response.message_body != null ? local.default_action_fixed_response_message_body[each.key] : null

      }
    }
  }

  lifecycle {
    create_before_destroy = false
  }
}

locals {
  default_action_fixed_response_message_body = {
    for value in var.alb_listeners :
    value.port =>
    value.default_action.fixed_response != null &&
    value.default_action.fixed_response.message_body != null &&
    value.default_action.fixed_response.message_body.template != null
    ? templatefile(
      value.default_action.fixed_response.message_body.template,
      value.default_action.fixed_response.message_body.vars
    )
    : null
  }
}
