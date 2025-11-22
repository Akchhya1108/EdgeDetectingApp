#include "opencv_processor.hpp"
#include "jni_utils.hpp"
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <vector>
#include <cstdint>
#include <memory>

using namespace cv;

namespace flamappai {

    class Pipeline {
    public:
        Pipeline(int w, int h)
                : width(w), height(h),
                  input(h, w, CV_8UC4),
                  gray(h, w, CV_8UC1),
                  edges(h, w, CV_8UC1),
                  output(h, w, CV_8UC4) {
            buffer.resize(static_cast<size_t>(w) * h * 4);
            LOGI("Pipeline initialized: %dx%d", w, h);
        }

        void process(const uint8_t* rgba, int mode) {
            // Copy input to OpenCV Mat
            std::memcpy(input.data, rgba, static_cast<size_t>(width) * height * 4);

            // Convert to grayscale
            cvtColor(input, gray, COLOR_RGBA2GRAY);

            // Apply filter based on mode
            switch (mode) {
                case 1: // Grayscale mode
                    cvtColor(gray, output, COLOR_GRAY2RGBA);
                    break;
                case 2: // Edge detection mode
                    Canny(gray, edges, 100, 200);
                    cvtColor(edges, output, COLOR_GRAY2RGBA);
                    break;
                case 0: // Raw mode (no processing)
                default:
                    input.copyTo(output);
                    break;
            }

            // Copy output to buffer
            std::memcpy(buffer.data(), output.data,
                        static_cast<size_t>(width) * height * 4);
        }

        const std::vector<uint8_t>& getBuffer() const { return buffer; }

    private:
        int width;
        int height;
        Mat input, gray, edges, output;
        std::vector<uint8_t> buffer;
    };

    static std::unique_ptr<Pipeline> gPipeline;

    void init(int w, int h) {
        LOGI("Initializing pipeline: %dx%d", w, h);
        gPipeline = std::make_unique<Pipeline>(w, h);
    }

    void release() {
        LOGI("Releasing pipeline");
        gPipeline.reset();
    }

    void processFrame(const uint8_t* rgba, int mode) {
        if (!gPipeline) {
            LOGE("Pipeline not initialized!");
            return;
        }
        gPipeline->process(rgba, mode);
    }

    const std::vector<uint8_t>& getOutput() {
        if (!gPipeline) {
            static std::vector<uint8_t> empty;
            return empty;
        }
        return gPipeline->getBuffer();
    }

} // namespace flamappai