import FloatingButton from '../../ui/floating-button';
import { argbHexToRgba } from '../../utils/convert';

export default function showFloatingButton(req, res) {
    const { value } = req;

    if (value.enabled) {
        let bgColor = argbHexToRgba(value.color);
        bgColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` : '';
        let color = argbHexToRgba(value.colorText);
        color = color ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` : '';
        let text;
        if ('text' in value) {
            text = value.text;
        } else if ('icon' in value) {
            text = `<span class='fa ${value.icon}'></span>`;
        } else {
            text = '!';
        }

        const callback = () => res.answer();

        FloatingButton.show(text, req.srcIframe[0], bgColor, color, callback);
    } else {
        FloatingButton.hide(req.srcIframe[0]);
    }
}
