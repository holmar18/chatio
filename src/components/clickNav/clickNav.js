import React from 'react';

function ClickNav(props) {
  return (
    <div
      className={'navigation'}
      style={{
        position: 'absolute',
        left: props.pageCords.x,
        top: props.pageCords.y,
      }}>
      {props.btns.map((btnText, id) => {
        return (
          <React.Fragment key={id}>
            <button
              type='button'
              className='navBtn'
              key={id}
              onClick={() => props._handleJoinChannel()}>
              {btnText}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ClickNav;
