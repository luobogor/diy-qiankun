import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 渲染子应用
 */
function Render() {
  return (
    <>
      <div id="subapp-viewport" />
    </>
  );
}

export default function render({ }) {
  const container = document.getElementById('subapp-container');
  ReactDOM.render(<Render />, container);
}
