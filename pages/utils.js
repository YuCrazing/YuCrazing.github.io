
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Check if the canvas is not the same size.
    if (canvas.width !== displayWidth ||
    canvas.height !== displayHeight) {
        
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function windowPosToUV(canvas, x, y) {
    const rect = canvas.getBoundingClientRect();
    res = {
        x: x - rect.left,
        y: y - rect.top,
    };
    // Convert to [0, 1] range
    res.x /= rect.width;
    res.y /= rect.height;
    res.y = 1 - res.y;
    return res
}


// Function to check for WebGL errors
function checkWebGLError(gl) {
    var error = gl.getError();
    if (error !== gl.NO_ERROR) {
        var errorString = '';
        switch (error) {
            case gl.INVALID_ENUM:
                errorString = 'INVALID_ENUM';
                break;
            case gl.INVALID_VALUE:
                errorString = 'INVALID_VALUE';
                break;
            case gl.INVALID_OPERATION:
                errorString = 'INVALID_OPERATION';
                break;
            case gl.INVALID_FRAMEBUFFER_OPERATION:
                errorString = 'INVALID_FRAMEBUFFER_OPERATION';
                break;
            case gl.OUT_OF_MEMORY:
                errorString = 'OUT_OF_MEMORY';
                break;
            case gl.CONTEXT_LOST_WEBGL:
                errorString = 'CONTEXT_LOST_WEBGL';
                break;
            default:
                errorString = 'Unknown WebGL error code ' + error;
                break;
        }
        console.error('WebGL Error: ', errorString);
    }
}

function getGLExtension(gl, name) {
    var ext = gl.getExtension(name);
    if (!ext) {
        var errString = 'Extension ' + name + ' not supported';
        alert(errString);
        console.error(errString);
    }
    return ext;
}