import React, { Component, Fragment } from 'react';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import { saveAllValue } from './utils';
import { connect } from 'dva';

@connect(() => ({

}))

export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.type === 'editRule' ? this.props.value : ["{", "}"].join(
                "\n"
            ),
            language: "java"
        };
    }
    componentDidMount() {
          saveAllValue({ payload: { jsonData: this.props.value }, props: this.props })
    }

    changeLanguage = () => {
        this.setState(prev => ({
            language: prev.language === "json" ? "json" : "javascritp"
        }));
    };
    onChange = (e) => {
        saveAllValue({ payload: { jsonData: e }, props: this.props })
    }

    editorWillMount = monaco => {
        return;
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [
                {
                    uri: "http://myserver/foo-schema.json",
                    schema: {
                        type: "object",
                        properties: {
                            p1: {
                                enum: ["v1", "v2"]
                            },
                            p2: {
                                $ref: "http://myserver/bar-schema.json"
                            }
                        }
                    }
                },
                {
                    uri: "http://myserver/bar-schema.json",
                    schema: {
                        type: "object",
                        properties: {
                            q1: {
                                enum: ["x1", "x2"]
                            }
                        }
                    }
                }
            ]
        });
    };

    render() {

        const { code, language } = this.state;
        const { width, height } = this.props;
        return (
            <div>
                <MonacoEditor
                    width={width || 800}
                    height={height || 300}
                    language={language}
                    defaultValue={code}
                    editorWillMount={this.editorWillMount}
                    onChange={this.onChange}
                    theme={'vs-dark'}
                />
            </div>
        );
    }
}