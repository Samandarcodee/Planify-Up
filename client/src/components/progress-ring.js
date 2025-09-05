import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ProgressRing({ progress, size = 64, strokeWidth = 8, className = "" }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    return (_jsxs("div", { className: `relative ${className}`, style: { width: size, height: size }, children: [_jsxs("svg", { className: "progress-ring", width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: "currentColor", strokeOpacity: "0.3", strokeWidth: strokeWidth, fill: "none" }), _jsx("circle", { className: "progress-ring-circle", cx: size / 2, cy: size / 2, r: radius, stroke: "currentColor", strokeWidth: strokeWidth, fill: "none", style: {
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        } })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-sm font-bold", children: [Math.round(progress), "%"] }) })] }));
}
