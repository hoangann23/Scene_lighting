#version 330 core

in vec4 position; // raw position in the model coord
in vec3 normal;   // raw normal in the model coord

uniform mat4 modelview; // from model coord to eye coord
uniform mat4 view;      // from world coord to eye coord

// Material parameters
uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform vec4 emision;
uniform float shininess;

// Light source parameters
const int maximal_allowed_lights = 10;
uniform bool enablelighting;
uniform int nlights;
uniform vec4 lightpositions[ maximal_allowed_lights ];
uniform vec4 lightcolors[ maximal_allowed_lights ];

// Output the frag color
out vec4 fragColor;


void main (void){
    if (!enablelighting){
        // Default normal coloring (you don't need to modify anything here)
        vec3 N = normalize(normal);
        fragColor = vec4(0.5f*N + 0.5f , 1.0f);
    } else {
        
        // HW3: You will compute the lighting here.
        
        // transform normal and position
        mat3 m = mat3(modelview);
        vec3 n_cam = normalize(transpose(inverse(m)) * normal);
        vec4 p_cam = modelview * position;
        vec4 viewer = vec4(0, 0, 0, 1);

        fragColor = emision;
        
        for (int i = 0; i < maximal_allowed_lights; i++) {
            vec4 lightPosition = view * lightpositions[i];

            vec3 lightXYZ = vec3(lightPosition[0], lightPosition[1], lightPosition[2]);
            vec3 posXYZ = vec3(p_cam[0], p_cam[1], p_cam[2]);
            vec3 viewerXYZ = vec3(viewer[0], viewer[1], viewer[2]);

            vec3 toLight = normalize((p_cam[3] * lightXYZ) - (lightPosition[3] * posXYZ));
            vec3 toViewer = normalize((p_cam[3] * viewerXYZ) - (viewer[3] * posXYZ));
            vec3 halfway = normalize(toViewer + toLight);

            vec4 dLight = diffuse * max(dot(n_cam, toLight), 0);
            vec4 sLight = specular * pow(max(dot(n_cam, halfway), 0), shininess);

            vec4 resulting = (ambient + dLight + sLight) * lightcolors[i];
            fragColor += resulting;
        }
        
    }
}
