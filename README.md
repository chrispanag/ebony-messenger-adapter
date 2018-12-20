# EBoNy Framework - SendAPI Submodule

A subsystem for EBoNy Framework compatible SendAPI message elements

## Documentation

### Message

Create a message

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
        new QuickReply("Hello", "hello"),
        new QuickReply("World", "world")
    ]
};

const message = new Message(options);
```

#### Attachment Message

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

#### Text Quick Replies

```javascript
// With text payload
new TextQuickReply("Title", "payload");

// With object payload
new TextQuickReply("title", { hello: "world" });
```

#### Location Quick Replies

```javascript
new LocationQuickReply()
```

### Attachments

#### Image Attachment

```javascript
new ImageAttachment("http://example.com/image.png");
```

#### Templates

##### ButtonTemplate

```javascript
new ButtonTemplate("Hello World", [
    new PostbackButton("Test", "test"),
    new UrlButton("Test", "http://example.com"),
    new CallButton("+3012345689")
]);
```

##### List Template

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

