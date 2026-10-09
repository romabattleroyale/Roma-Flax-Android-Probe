extends Node3D

func _ready() -> void:
    var floor_material := StandardMaterial3D.new()
    floor_material.albedo_color = Color(0.24, 0.28, 0.34)
    floor_material.roughness = 0.95
    $Floor.set_surface_override_material(0, floor_material)

    var box_mesh := BoxMesh.new()
    box_mesh.size = Vector3(1.8, 1.8, 1.8)
    var box := MeshInstance3D.new()
    box.name = "VisibleTestCube"
    box.mesh = box_mesh
    box.position = Vector3(0, 0.35, 0)
    var box_material := StandardMaterial3D.new()
    box_material.albedo_color = Color(0.95, 0.38, 0.12)
    box_material.roughness = 0.7
    box.set_surface_override_material(0, box_material)
    add_child(box)

    var label := Label3D.new()
    label.text = "ROMA • GODOT ANDROID TEST"
    label.font_size = 48
    label.pixel_size = 0.004
    label.position = Vector3(-2.4, 1.7, 0)
    label.modulate = Color(1.0, 0.86, 0.45)
    add_child(label)
