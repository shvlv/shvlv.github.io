---
layout: post
title: "About WordPress backward compatibility"
date: 2025-01-27 17:36:00 +0200
categories:
  - WordPress
  - BC
---

I've heard and [read](https://schlessera.github.io/ipc-2020-12-a/#/) about WordPress backward
compatibility, but in the last weeks, I got a bit of free time to refresh the 10-year-old
WooCommerce
plugin - [Woo Product Add Tab](https://github.com/shvlv/woo-product-add-tab). The last release 0.8
was created on Oct 1, 2015. It required WordPress 3.0.1 and WooCommerce 2.4.6.
How does it work now with WordPress 6.7 and WooCommerce 9.5?

First of all, the plugin still makes sense. Despite Site Editor support, WooCommerce still doesn't
provide a possibility to create custom product tabs.

Second, the plugins still work! You can check the PR
here - https://github.com/shvlv/woo-product-add-tab/pull/1.
The single actual change is replacing the deprecated hook `woocommerce_product_write_panels` with
`woocommerce_product_data_panels`. While the old one
still [works](https://github.com/woocommerce/woocommerce/blob/a7b5527113588c0b85b6960ecb5f80eb66abb898/plugins/woocommerce/includes/admin/meta-boxes/views/html-product-data-panel.php#L54-L55)(!)
as well. Other changes include small bug fixes and appearance adjustments.

Summary. WordPress and WooCommerce provide super-backward compatibility. The 10-year-old PHP 5.6
code
still works almost without changes. The hook deprecated in version 2 still works for version 9 :).

Regarding the plugin itself, the plan is to improve it step-by-step according to the common
development
standards and add the block editor support. Let's see how it goes.
