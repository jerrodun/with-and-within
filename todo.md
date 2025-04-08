General:
[x] Now the background setting is being overidden when we have more than one of these sections on a page. Go through ALL settings that are CSS related and esnsure we target them at the section.id level for proper scope.
  [x] testimonials.liquid
  [x] modular-richtext.liquid
  [x] image-with-content.liquid
  [x] faq.liquid
  [x] location.liquid
  [x] service-blocks.liquid


testimonials.liquid:
[x] The next/prev buttons are messed up. Please remove these buttons entirely and start from scratch. All we want is the snippet icon. Make sure the 'next' icon is untouched, and the 'prev' icon is flipped horizontally.

image-with-content.liquid: 
[x] This section is now broken. The image overlaps the content and goes slightly beyond 50%:
  [x] Make the image 50% width (ignoring all top, bottom, and left/right padding). It's fine if it's locked to parent container/wrapper
  [x] Make the content 50% but respects padding


location.liquid:
[x] The heading size isn't working. The setting should also be below the heading setting.


