

export default {
  bind(el) {
    const oDiv = el;

    const touchMoveHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    el.$touchMove = touchMoveHandler;
    // el.$touchEnd = touchEndHandler;
    // el.$touchCancel = touchCancelHandler;
    // oDiv.addEventListener('touchstart', touchStartHandler, false);
    oDiv.addEventListener('touchmove', touchMoveHandler, false);
    // oDiv.addEventListener('touchend', touchEndHandler, false);
    // oDiv.addEventListener('touchcancel', touchCancelHandler, false);
  },
  update() {

  },
  unbind(el) {
    // el.removeEventListener('touchstart', el.$touchStart);
    el.removeEventListener('touchmove', el.$touchMove);
    // el.removeEventListener('touchend', el.$touchEnd);
    // el.removeEventListener('touchcancel', el.$touchCancel);
    // delete el.$touchStart;
    delete el.$touchMove;
    // delete el.$touchEnd;
    // delete el.$touchCancel;
  },
};
