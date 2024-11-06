
const uiSchema  = (title) => {
    return {
        "ui:options": {
            "title": title,
            "classNames": "form form-group form-control header input",
        },
        'ui:globalOptions': {copyable: true},
        'ui:style': {
            'html': {
                'font-family': "'Open Sans', sans-serif"
            }
        },
        "notes": {
            "ui:widget": "textarea"
        },
    }
}

export default uiSchema