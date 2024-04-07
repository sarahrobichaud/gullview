![Logo](/images/logo.svg)

A lightbox library for images.

**🚧 In development**

---

**⚙️ Documentation is a work in progress**

# Installation

# Usage

### Via CDN

**⚙️ Work in progress**

### Module import

```js
//import

const gv = Gullview.build();

gv.init();
```

You can pass in a configuration object into the `build` method. See [configuration](#configuration).

### Markup

```html
<div class="gullview"></div>

<div class="gv_src">
    <img src="./demo-images/1.jpg" alt="Alt text 1" />
</div>
<div class="gv_src">
    <img src="./demo-images/2.jpg" alt="Alt text 2" />
</div>
<div class="gv_src">
    <img src="./demo-images/3.jpg" alt="Alt text 3" />
</div>
```

For markup, there are 3 things needed:

1. An empty div element with a class of `gullview`.
2. Some image cards with a class of `gv_src`.
    - To customize the class name, see configuration.
3. The specified cards should contain an `img` element with a `src` and `alt` attribute.

### Styling

You can customize the look by providing these CSS variables:

```css
--gv-arrow-clr: #fff;

--gv-counter-clr: #fff;
--gv-counter-fs: 1.5rem;
--gv-counter-ff: monospace;

--gv-background: rgba(0, 0, 0, 0.8);
```

# Configuration

## Specifying a custom target class

#### API

| key                | value  | default  |
| ------------------ | ------ | -------- |
| config.targetClass | string | "gv_src" |

The lightbox will grab all elements with the specified class. The class should be on an element wrapping an `img` tag.

**Example:**

```html
<div class="gv_src">
    <img src="./demo-images/3.jpg" alt="Alt text 3" />
</div>
```

## Zoom

#### API

| key                | value   | default |
| ------------------ | ------- | ------- |
| zoom.enabled       | boolean | false   |
| zoom.level         | number  | 3       |
| zoom.preventNative | boolean | true    |

### Enabled

Toggles the zoom functionality.

### Level

Set the zoom level when a user zoom.

> **Note**: Setting this higher than 3 is not recommended.

### Prevent native

When set to `true` this will prevent the zooming via the `ctrl` shortcut when the lightbox is opened.

### Example

This enables the zoom functionality and sets the zoom level to 2x.

```ts
Gullview.build({
    zoom: {
        enabled: true,
        level: 2,
    },
}).init();
```

![Zoom demo](./images/zoom-demo.gif)

## Display

Display represents the main img element showns in the lightbox.

#### API

| key                              | value   | default           |
| -------------------------------- | ------- | ----------------- |
| display.animation.enabled        | boolean | false             |
| display.animation.duration       | number  | false             |
| display.animation.keyframes_next | string  | "gv_display_next" |
| display.animation.keyframes_prev | string  | "gv_display_prev" |
| display.animation.morph.enabled  | boolean | false             |
| display.animation.morph.duration | number  | false             |

### Animation

#### Enabled

This toggles the an

#### Duration

This specifies the "prev" and "next animation duration.

#### Keyframes

You can pass in custom CSS keyframes name to be used for the "prev" and "next" animation.

#### Morph

You can enable images to "morph" from their original position with `morph.enabled`.

The duration can also be passed in as `morph.duration`.

### Example:

This is an example all the display animations enabled.

```ts
Gullview.build({
    display: {
        animation: {
            enabled: true,
            morph: { enabled: true },
        },
    },
}).init();
```

![Animation demo](./images/animation-demo.gif)

## Counter

This in and optional component that provides a count the image's total and the current image.

#### API

| key                        | value   | default |
| -------------------------- | ------- | ------- |
| counter.enabled            | boolean | false   |
| counter.animation.duration | number  | false   |

## Custom CSS Keyframes

# Dependencies

# Local development

**⚙️Work in progress**
