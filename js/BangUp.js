
export default class BangUp {
    constructor(app, target, duration, startVal, endVal, delay = 0, onStart = null, onUpdate = null, onComplete = null) {
        this.app = app;
        let tween = TweenMax.to(target, duration,
            {
                delay: delay,
                onStart: () => {
                    target.text = startVal
                },
                onUpdate: () => {
                    let currentValue = +startVal + ((endVal - startVal) * tween.progress());
                    target.text = Math.ceil(currentValue);
                },
                onComplete: () => {
                    target.text = endVal;
                }
            }
        );
    }
}
