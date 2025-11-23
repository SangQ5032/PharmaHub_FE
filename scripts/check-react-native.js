/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

try {
	const resolved = require.resolve('react-native', { paths: [process.cwd()] });
	console.log('OK: react-native được tìm thấy tại:', resolved);
} catch (err) {
	console.error('KHÔNG TÌM THẤY react-native trong dự án.');
	console.error('Hãy chạy: yarn install');
	console.error('Nếu gặp lỗi engine incompatibility, nâng Node lên phiên bản phù hợp (ví dụ 20.19.4).');
	process.exitCode = 1;
}
