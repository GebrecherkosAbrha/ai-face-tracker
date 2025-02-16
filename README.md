# AI Face Tracker

![CI Status](https://github.com/GebrecherkosAbrha/ai-face-tracker/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A real-time face tracking application built with Face-API.js and modern web technologies. This application provides live face detection, facial landmark tracking, and performance metrics.

![AI Face Tracker Demo](demo-screenshot.png)

## Features

- Real-time face detection and tracking
- Facial landmark visualization
- Live performance metrics:
  - FPS counter
  - Face detection confidence
  - Processing time
- Snapshot capability with overlay effects
- Responsive design for desktop and mobile
- Dark mode interface
- Toggle-able tracking visualization

## Technologies Used

- Face-API.js for face detection and landmark tracking
- TensorFlow.js as the underlying ML engine
- HTML5 Canvas for rendering
- Modern JavaScript (ES6+) with OOP principles
- CSS Grid and Flexbox for responsive layout

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam
- Local development server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GebrecherkosAbrha/ai-face-tracker.git
cd ai-face-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:8080
```

## Testing

Run unit tests:
```bash
npm test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── css/
│   └── styles.css    # Application styling
├── js/
│   ├── app.js        # Main application logic
│   └── config.js     # Configuration settings
└── index.html        # Main HTML file
```

## Implementation Details

- Object-Oriented design with modular architecture
- Real-time video processing with optimized performance
- Custom face detection parameters for improved accuracy
- Responsive canvas sizing and display management
- Error handling and user feedback
- Performance optimization with FPS smoothing

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: Must be run on HTTPS or localhost due to browser security restrictions for camera access.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Face-API.js](https://github.com/justadudewhohacks/face-api.js) for the face detection library
- [TensorFlow.js](https://www.tensorflow.org/js) for the machine learning capabilities 