import React, { Component } from 'react';
import { notification } from 'antd';

export default function prompt({ type = 'success', title = 'TIPS', content, duration }) {
  notification[type]({
    message: title,
    description: content,
    duration: duration ? duration : type === 'warn' ? 4 : type === 'success' ? 2 : null,
    style: {
      marginTop: 80,
    },
  });
}
