# Ebony Messenger Adapter

A messenger platform adapter for the [Ebony Framework](https://github.com/chrispanag/ebony)

## Documentation

### !!! This documentation might be outdated. It will be updated soon !!!

### Message

Create a message

Available Options:

* **text:** Message text. Previews will not be shown for the URLs in this field. Use attachment instead. Must be UTF-8 and has a 2000 character limit. Text or attachment must be set.
* **attachment:** Attachment object. Previews the URL. Used to send messages with media or Structured Messages. Text or attachment must be set.
* **quickreplies:** Optional. Array of QuickReply to be sent with messages
* **metadata:** Not yet implemented (TODO)

#### Text Message

##### Without Quick Replies

```javascript
const options = {
    text: "Hello World"
};

const message = new Message(options);
```

##### With Quick Replies

```javascript
const options = {
    text: "Hello World",
    quickreplies: [
        new TextQuickReply("Hello", "hello"),
        new LocationQuickReply()
    ]
};

const message = new Message(options);
```

#### Attachment Message

The following can be included in the attachment object:

* Rich media messages including images, audios (TODO), videos (TODO), or files (TODO).
* Templates including generic template, button template, receipt template (TODO), or list template.

```javascript
const options = {
    attachment: new GenericTemplate({
        elements: [
                cardElement({
                    title: "Test",
                    subtitle: "Test"
                    buttons: [new UrlButton("Test", "Test")]
                }),
                cardElement({
                    title: "Test",
                    subtitle: "Test"
                    buttons: [new UrlButton("Test", "Test")]
                })
        ]
    })
};

const message = new Message(options);
```

### Quick Replies

The following quick reply types are supported:

* Text
* Location
* Phone Number (Not Implemented: TODO)
* Email (Not Implemented: TODO)

#### Text Quick Replies

Params:

* **title**: The text to display on the quick reply button. 20 character limit.
* **payload**: Custom data that will be sent back to you via the messaging_postbacks webhook event. 1000 character limit. May be set to an empty string if image_url is set (not implemented).

```javascript
// With text payload
new TextQuickReply("Title", "payload");

// With object payload
new TextQuickReply("title", { hello: "world" });
```

#### Location Quick Replies

Sends a button to collect the recipient's location

```javascript
new LocationQuickReply()
```

### Attachments

#### Image Attachment

Sends the image specified in the URL

```javascript
new ImageAttachment("http://example.com/image.png");
```

#### Templates

##### ButtonTemplate

Params:

* **text:** UTF-8-encoded text of up to 640 characters. Text will appear above the buttons.
* **buttons:** Set of 1-3 buttons that appear as call-to-actions. (Array of Button)

```javascript
new ButtonTemplate("Hello World", [
    new PostbackButton("Test", "test"),
    new UrlButton("Test", "http://example.com"),
    new CallButton("+3012345689")
]);
```

##### List Template

Options:

* **elements:** Array of listElement. Minimum of 2 elements required. Maximum of 4 elements is supported.
* **buttons:** Button to display at the bottom of the list. Maximum of 1 button is supported. (Array of Button)
* **large:** Sets the format of the first list items. Messenger web client currently only renders compact. compact (false): Renders a plain list item. large (true): Renders the first list item as a cover item.

```javascript
new ListTemplate({
    elements: [
        listElement({
            title: "Test",
            subtitle: "test",
            buttons: [new PostbackButton("Test", "test")]
        }),
        listElement({
            title: "Test",
            subtitle: "test",
            buttons: [new PostbackButton("Test", "test")]
        }),
        listElement({
            title: "Test",
            subtitle: "test",
            buttons: [new PostbackButton("Test", "test")]
        }),
        listElement({
            title: "Test",
            subtitle: "test",
            buttons: [new PostbackButton("Test", "test")]
        })
    ],
    buttons: [new PostbackButton("Test", "test")],
    large: false
});
```

listElement params:

* **title:** String to display as the title of the list item. 80 character limit. May be truncated if the title spans too many lines. Element must also have one or both of image_url or subtitle set.
* **subtitle:** String to display as the subtitle of the list item. 80 character limit. May be truncated if the subtitle spans too many lines. Element must have one or both of image_url or subtitle set.
* **image_url:** URL of the image to display in the list item. Element must have one or both of image_url or subtitle set.
* **buttons:** Button to display on the list item. Maximum of 1 button is supported (Array of Button)
* **default_action:** URL button that specifies the default action to execute when the list item is tapped. Only allowed when messenger_extensions property is set to true. (Wrongly Implemented: TODO)

##### Generic Template

Params:

* **elements:** An array of element objects that describe instances of the generic template to be sent. Specifying multiple elements will send a horizontally scrollable carousel of templates. A maximum of 10 elements is supported. (Array of cardElement)
* **image_aspect_ratio:** The aspect ratio used to render images specified by element.image_url. Must be horizontal (1.91:1) or square (1:1). Defaults to horizontal.

```javascript
new GenericTemplate([
    cardElement({
        title: "Test",
        subtitle: "Test",
        buttons: [new PostbackButton("Test", "test")]
    }),
    cardElement({
        title: "Test",
        subtitle: "Test",
        buttons: [new PostbackButton("Test", "test")]
    }),
    cardElement({
        title: "Test",
        subtitle: "Test",
        buttons: [new PostbackButton("Test", "test")]
    })
], "horizontal")
```

cardElement params:

* **title:** The title to display in the template. 80 character limit.
* **subtitle:** The subtitle to display in the template. 80 character limit.
* **image_url:** The URL of the image to display in the template.
* **buttons:** An array of buttons to append to the template. A maximum of 3 buttons per element is supported. (Array of Button)
* **default_action:** The default action executed when the template is tapped. Accepts the same properties as URL button, except title (Wrongly Implemented TODO).

### Buttons

#### URL Button

```javascript
new UrlButton("Title", "http://example.com");
```

#### Postback Button

```javascript
new PostbackButton("Title", "payload");
```

#### Share Button

Params:

* **share_contents:** The message that you wish the recipient of the share to see, if it is different from the one this button is attached to. The format follows that used in Send API. (Generic Template)

**share_contents only supports the following:**

Template used must be Generic Template. Maximum of one URL button on the template. If no buttons are specified, the buttons property on the generic template must be set to an empty array.

```javascript
new ShareButton(share_contents);
```

#### Call Button

```javascript
new CallButton("Test", "+301234567891");
```

### Sender

Params:

* **fb:** The sending library used. Must have a `sendAPI` property.

Returns:

The send function.

```javascript
const send = sender(fb);
```

### Send Function

Params:

* **id**: The PSID of the user
* **message**: A Message Object
* **options**: The next object

``` javascript
{
    tag,                // The message tag string.  
    notification_type,  // Push notification type (REGULAR, SILENT_PUSH, NO_PUSH)
    type                // The messaging type of the message being sent.
}
```

Example:

```javascript
send(id, message, options);
```
