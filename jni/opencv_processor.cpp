#include "opencv_processor.hpp"
#include "jni_utils.hpp"

namespace flamappai {
    void init(int w, int h) {
        LOGI("OpenCV processor init: %dx%d", w, h);
    }

    void release() {
        LOGI("OpenCV processor release");
    }

    void processFrame(const uint8_t* rgba, int mode) {
        LOGI("Processing frame, mode: %d", mode);
    }

    const std::vector<uint8_t>& getOutput() {
        static std::vector<uint8_t> dummy;
        return dummy;
    }
}