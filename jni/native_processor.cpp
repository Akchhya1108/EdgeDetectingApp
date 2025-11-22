#include <jni.h>
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
(void)env; (void)clazz; (void)rgbaIn; (void)width; (void)height; (void)mode;
LOGI("nativeProcessFrameRgba placeholder");
}