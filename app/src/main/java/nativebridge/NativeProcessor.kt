package com.flamappai.nativebridge

object NativeProcessor {

    init {
        System.loadLibrary("opencv_java4")
        System.loadLibrary("flam_native")
    }

    external fun nativeInit(width: Int, height: Int)

    external fun nativeRelease()

    external fun nativeProcessFrameRgba(
        rgba: ByteArray,
        width: Int,
        height: Int,
        mode: Int
    )
}