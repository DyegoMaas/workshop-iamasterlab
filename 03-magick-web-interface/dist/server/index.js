"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const image_1 = require("./routes/image");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const tmpDir = path_1.default.join(process.cwd(), 'tmp', 'magick');
if (!fs_1.default.existsSync(tmpDir)) {
    fs_1.default.mkdirSync(tmpDir, { recursive: true });
}
app.use((0, morgan_1.default)('combined'));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use('/api', image_1.imageRoutes);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../client/dist/index.html'));
    });
}
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Temp directory: ${tmpDir}`);
});
exports.default = app;
