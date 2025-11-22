#include <jni.h>
#include <vector>
#include "jni_utils.hpp"
#include "opencv_processor.hpp"

using namespace flamappai;

extern "C"
JNIEXPORT void JNICALL
Java_com_flamappai_nativebridge_NativeProcessor_nativeInit(
        JNIEnv* env,
        jclass clazz,
        jint width,
        jint height) {
    (void)env; (void)clazz;
    LOGI("nativeInit %dx%d", width, height);
    init(width, height);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_flamappai_nativebridge_NativeProcessor_nativeRelease(
        JNIEnv* env,
        jclass clazz) {
    (void)env; (void)clazz;
    LOGI("nativeRelease");
    release();
}

extern "C"
JNIEXPORT void JNICALL
Java_com_flamappai_nativebridge_NativeProcessor_nativeProcessFrameRgba(
        JNIEnv* env,
        jclass clazz,
        jbyteArray rgbaIn,
        jint width,
        jint height,
        jint mode) {
    (void)clazz;

    // Get array length and validate
    jsize len = env->GetArrayLength(rgbaIn);
    if (len < width * height * 4) {
        LOGE("Input buffer too small: %d < %d", len, width * height * 4);
        return;
    }

    // Get pointer to Java byte array
    jbyte* data = env->GetByteArrayElements(rgbaIn, nullptr);
    if (!data) {
        LOGE("Failed to get array elements");
        return;
    }

    // Process the frame
    processFrame(reinterpret_cast<uint8_t*>(data), mode);

    // Copy processed data back into same array (in-place modification)
    const auto& out = getOutput();
    env->SetByteArrayRegion(
            rgbaIn, 0, static_cast<jsize>(out.size()),
            reinterpret_cast<const jbyte*>(out.data()));

    // Release the array
    env->ReleaseByteArrayElements(rgbaIn, data, 0);
}