General:
[x] Buttons on hover go white, which doesn't work on #fff backgrounds. Let's make sure we keep the border-color and color the same as the background-color on hover:
  [x] testimonials.liquid
  [x] modular-richtext.liquid
  [x] image-with-content.liquid
  [x] faq.liquid
  [x] location.liquid
  [x] service-blocks.liquid


service-blocks.liquid:
[x] The middle line is too thick because we're seeing a double border (from both blocks) - so either left/right needs to be removed

testimonials.liquid:
[x] The icons/buttons look good now, but there is a background color hover effect we need removed.
[x] The icon/buttons have a z-index issue (overlapping header)


image-with-content.liquid: 
[x] .image-with-content__heading needs to be a heading (add a heading size setting here too)