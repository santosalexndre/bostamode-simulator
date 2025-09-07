extern float WhiteFactor;
extern vec2 texture_size;

vec4 effect(vec4 vcolor, Image tex, vec2 texcoord, vec2 pixcoord)
{
    vec4 base = Texel(tex, texcoord) * vcolor;

    // Whitening
    base.rgb += vec3(WhiteFactor);

    // Simple 3x3 box blur
    vec2 texel = 1.0 / texture_size; // texel size

    vec4 sum = vec4(0.0);
    for (int x = -1; x <= 1; x++)
    {
        for (int y = -1; y <= 1; y++)
        {
            sum += Texel(tex, texcoord + vec2(x, y) * texel);
        }
    }

    vec4 blur = sum / 9.0;

    // Mix the original pixel with blur for subtle smoothing
    vec4 outputcolor = mix(base, blur, 0.7); // 0.5 = 50% blur

    return outputcolor;
}