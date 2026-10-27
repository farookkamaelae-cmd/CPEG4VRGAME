// Programming Lab
// 3D Classroom and Programming Quiz
// Compatible with the shared A-Frame scene

(function () {
  "use strict";

  window.SimulatorRooms = window.SimulatorRooms || {};

  window.SimulatorRooms.programming = function createProgrammingRoom(context) {
    const THREE = AFRAME.THREE;
    const Data = window.ProgrammingRoom.Data;
    const game = window.ProgrammingRoom.Game.create();

    const COLORS = {
      wall: "#343451",
      back: "#232443",
      ceiling: "#15172e",
      floor: "#333550",
      desk: "#aa8bb8",
      legs: "#252940",
      monitor: "#151a32",
      screen: "#081a30",
      cyan: "#83f2e5",
      purple: "#dbb9ff",
      pink: "#ffb7d5",
      yellow: "#ffd29f",
      green: "#baf6ca",
      blue: "#a7d9ff",
      white: "#eaf4ff"
    };

    let root = null;
    let workstation = null;
    let keyboard = null;
    let gamePanel = null;
    let dropTarget = null;

    let hud = null;
    let footer = null;
    let dragGhost = null;

    let active = false;
    let playing = false;
    let dragging = null;

    let clickHandler = null;
    let mouseDownHandler = null;
    let keyDownHandler = null;
    let keyUpHandler = null;
    let dragMoveHandler = null;
    let dragEndHandler = null;

    let animationId = null;
    let lastTime = 0;

    const pressedKeys = new Set();
    const panelResources = new Set();
    const originalDisplay = {};

    // ==================================================
    // BASIC HELPERS
    // ==================================================

    function create(tag, attributes, parent) {
      const element = document.createElement(tag);

      Object.entries(attributes || {}).forEach(function ([key, value]) {
        element.setAttribute(key, value);
      });

      if (parent) {
        parent.appendChild(element);
      }

      return element;
    }

    function box(parent, position, size, color, options) {
      return create("a-box", Object.assign({
        position: position.join(" "),
        width: size[0],
        height: size[1],
        depth: size[2],
        material: "shader: flat; color: " + color
      }, options || {}), parent);
    }

    function sphere(parent, position, radius, color) {
      return create("a-sphere", {
        position: position.join(" "),
        radius: radius,
        "segments-width": 12,
        "segments-height": 8,
        material: "shader: flat; color: " + color
      }, parent);
    }

    function addLight(parent, position, color, intensity) {
      return create("a-entity", {
        position: position.join(" "),
        light:
          "type: point; color: " + color +
          "; intensity: " + intensity +
          "; distance: 6; decay: 2"
      }, parent);
    }

    function roundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
      );
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    function wrapText(ctx, text, maxWidth) {
      const output = [];

      String(text).split("\n").forEach(function (paragraph) {
        if (!paragraph) {
          output.push("");
          return;
        }

        let line = "";

        paragraph.split(" ").forEach(function (word) {
          const next = line ? line + " " + word : word;

          if (ctx.measureText(next).width <= maxWidth) {
            line = next;
          } else {
            if (line) output.push(line);
            line = word;
          }
        });

        if (line) output.push(line);
      });

      return output;
    }

    // ==================================================
    // 3D TEXT PANELS
    // ==================================================

    function disposePanel(element) {
      if (!element || !element._panelResources) return;

      const resources = element._panelResources;

      resources.texture.dispose();
      resources.geometry.dispose();
      resources.material.dispose();

      panelResources.delete(element);
      element._panelResources = null;
    }

    function clearPanels(group) {
      if (!group) return;

      group.querySelectorAll("*").forEach(disposePanel);
      disposePanel(group);
      group.remove();
    }

    function panel(parent, settings) {
      const width = settings.width || 2;
      const height = settings.height || 0.5;

      const canvas = document.createElement("canvas");

      canvas.width = 1024;
      canvas.height = Math.max(
        128,
        Math.round(canvas.width * height / width)
      );

      const ctx = canvas.getContext("2d");
      const color = settings.color || COLORS.white;
      const background = settings.background || "#17213e";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (background !== "transparent") {
        ctx.fillStyle = background;

        roundedRect(
          ctx,
          18,
          18,
          canvas.width - 36,
          canvas.height - 36,
          35
        );

        ctx.fill();
      }

      if (settings.border) {
        ctx.strokeStyle = settings.border;
        ctx.lineWidth = settings.borderWidth || 9;
        ctx.shadowColor = settings.border;
        ctx.shadowBlur = settings.glow === false ? 0 : 30;

        roundedRect(
          ctx,
          20,
          20,
          canvas.width - 40,
          canvas.height - 40,
          35
        );

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      const fontSize = settings.fontSize || 64;

      ctx.fillStyle = color;
      ctx.textAlign = settings.align || "center";
      ctx.textBaseline = "middle";

      ctx.font =
        (settings.bold ? "bold " : "") +
        fontSize + "px " +
        (settings.code
          ? "Consolas, monospace"
          : "Arial, sans-serif");

      const lines = wrapText(
        ctx,
        settings.text || "",
        canvas.width - 100
      );

      const lineHeight = fontSize * 1.3;
      const blockHeight = lines.length * lineHeight;

      const firstY =
        (canvas.height - blockHeight) / 2 +
        lineHeight / 2;

      lines.forEach(function (line, index) {
        ctx.fillText(
          line,
          ctx.textAlign === "left" ? 52 : canvas.width / 2,
          firstY + index * lineHeight,
          canvas.width - 104
        );
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.PlaneGeometry(width, height);

      const isGameUI = Boolean(
        gamePanel &&
        parent &&
        (parent === gamePanel || gamePanel.contains(parent))
      );

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: !isGameUI
      });

      const mesh = new THREE.Mesh(geometry, material);

      if (isGameUI) {
        mesh.renderOrder = 1000;
      }

      const element = create("a-entity", {
        position: (settings.position || [0, 0, 0]).join(" "),
        rotation: (settings.rotation || [0, 0, 0]).join(" ")
      }, parent);

      element.setObject3D("mesh", mesh);

      element._panelResources = {
        texture: texture,
        geometry: geometry,
        material: material
      };

      panelResources.add(element);

      if (settings.action) {
        element.classList.add("selectable");
        element.dataset.action = settings.action;
        element.dataset.value = String(settings.value ?? "");
      }

      return element;
    }

    function button(parent, text, position, width, action, value, color) {
      return panel(parent, {
        text: text,
        position: position,
        width: width,
        height: 0.43,
        fontSize: 60,
        bold: true,
        color: COLORS.white,
        background: color || "#28385c",
        border: COLORS.cyan,
        action: action,
        value: value
      });
    }

    function line(parent, points, color) {
      const geometry = new THREE.BufferGeometry();

      geometry.setFromPoints(
        points.map(function (point) {
          return new THREE.Vector3(
            point[0],
            point[1],
            point[2]
          );
        })
      );

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.85
      });

      const mesh = new THREE.Line(geometry, material);
      const element = create("a-entity", {}, parent);

      element.setObject3D("mesh", mesh);

      element._panelResources = {
        texture: {
          dispose: function () {}
        },
        geometry: geometry,
        material: material
      };

      panelResources.add(element);
    }

    // ==================================================
    // ROOM ENVIRONMENT
    // ==================================================

    function buildEnvironment() {
            // Shared floor, ceiling, and walls come from SimulatorRoomStructure.

const lights = [
        COLORS.cyan,
        COLORS.purple,
        COLORS.pink,
        COLORS.yellow,
        COLORS.green
      ];

      lights.forEach(function (color, index) {
        const x = -3.2 + index * 1.6;

        box(
          root,
          [x, 7.76, -0.3],
          [1.25, 0.055, 0.18],
          color
        );

        addLight(root, [x, 7.1, -1], color, 1.25);
      });

      box(
        root,
        [0, 3.68, -3.92],
        [4, 0.07, 0.08],
        COLORS.cyan
      );

      const floorLines = [
        [[-3.7, 0.025, -3.7], [3.7, 0.025, -3.7]],
        [[3.7, 0.025, -3.7], [3.7, 0.025, 3.7]],
        [[-3.7, 0.025, 3.7], [3.7, 0.025, 3.7]],
        [[-3.7, 0.025, -3.7], [-3.7, 0.025, 3.7]]
      ];

      floorLines.forEach(function (points) {
        line(root, points, COLORS.cyan);
      });

      for (let i = 0; i < 7; i++) {
        const x = -3.15 + i * 1.05;
        const y = 2.15 + (i % 3) * 0.55;
        const color = lights[i % lights.length];

        line(root, [
          [x - 0.45, y, -3.92],
          [x - 0.1, y, -3.92],
          [x + 0.15, y + 0.28, -3.92],
          [x + 0.52, y + 0.28, -3.92]
        ], color);

        sphere(
          root,
          [x + 0.52, y + 0.28, -3.88],
          0.055,
          color
        );
      }

      [
        [-3.1, -3.1, COLORS.purple],
        [3.1, -3.1, COLORS.cyan],
        [-3.1, 2.5, COLORS.pink],
        [3.1, 2.5, COLORS.yellow]
      ].forEach(function (item) {
        create("a-circle", {
          position: item[0] + " 0.014 " + item[1],
          rotation: "-90 0 0",
          radius: 0.65,
          material:
            "shader: flat; color: " + item[2] +
            "; transparent: true; opacity: 0.18; side: double"
        }, root);
      });
    }

    // ==================================================
    // WORKSTATION
    // ==================================================

    function buildWorkstation() {
      workstation = create("a-entity", {
        position: "0 0 0.85",
        scale: "1.08 1.08 1.08"
      }, root);

      box(workstation, [0, 0.87, -1.35], [3.8, 0.14, 1.1], COLORS.desk);
      box(workstation, [-1.53, 0.87, -0.1], [0.75, 0.14, 1.65], COLORS.desk);
      box(workstation, [1.53, 0.87, -0.1], [0.75, 0.14, 1.65], COLORS.desk);

      [-1.65, 1.65].forEach(function (x) {
        [-1.72, 0.4].forEach(function (z) {
          box(
            workstation,
            [x, 0.42, z],
            [0.13, 0.83, 0.13],
            COLORS.legs
          );
        });
      });

      box(
        workstation,
        [0, 1.73, -1.9],
        [2.15, 1.34, 0.14],
        COLORS.monitor
      );

      box(
        workstation,
        [0, 1.73, -1.808],
        [1.96, 1.13, 0.02],
        COLORS.screen
      );

      box(workstation, [0, 1.06, -1.92], [0.16, 0.5, 0.16], "#65758e");
      box(workstation, [0, 0.86, -1.9], [0.75, 0.05, 0.4], "#56647c");

      panel(workstation, {
        text: "PROGRAMMING LAB",
        position: [0, 1.97, -1.785],
        width: 1.75,
        height: 0.25,
        fontSize: 71,
        bold: true,
        background: "transparent",
        color: COLORS.cyan
      });

      panel(workstation, {
        text: "Press E or keyboard to begin",
        position: [0, 1.7, -1.784],
        width: 1.75,
        height: 0.2,
        fontSize: 43,
        background: "transparent",
        color: "#d5e8fa"
      });

      button(
        workstation,
        "START GAME",
        [-0.37, 1.48, -1.775],
        0.95,
        "start",
        "",
        "#254f79"
      );

      keyboard = box(
        workstation,
        [0, 0.97, -0.93],
        [1.25, 0.055, 0.38],
        "#232b48",
        { class: "selectable" }
      );

      keyboard.dataset.action = "start";

      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 12; column++) {
          box(
            workstation,
            [
              -0.48 + column * 0.087,
              1.001,
              -1.04 + row * 0.105
            ],
            [0.07, 0.008, 0.07],
            column % 4 === 0 ? "#7b91bf" : "#b5c8dd"
          );
        }
      }

      box(
        workstation,
        [0.87, 0.96, -0.94],
        [0.17, 0.035, 0.25],
        "#505b87"
      );
    }

    // ==================================================
    // FLOATING SIGNS
    // ==================================================

    function makeFloatingSign(text, color, position, rotation, size, index) {
      const sign = panel(root, {
        text: text + "\nPROGRAMMING",
        position: position,
        rotation: [0, rotation, 0],
        width: 1.75 * size,
        height: 1.3 * size,
        fontSize: 116,
        bold: true,
        color: color,
        background: "#111d3c",
        border: color,
        borderWidth: 10
      });

      sign.setAttribute("animation", {
        property: "position",
        from: position.join(" "),
        to: [
          position[0],
          position[1] + 0.12,
          position[2]
        ].join(" "),
        dir: "alternate",
        loop: true,
        dur: 1800 + index * 190,
        easing: "easeInOutSine"
      });
    }

    function buildFloatingSigns() {
      const signs = [
        ["</>", COLORS.cyan, [-3.6, 2.6, -2.5], 15, 0.85],
        ["{ }", COLORS.purple, [-2.2, 3.25, -3.7], 7, 0.7],
        ["( )", COLORS.blue, [3.6, 2.75, -2.75], -15, 0.87],
        ["01", COLORS.yellow, [2.3, 3.4, -3.7], -9, 0.7],
        ["++", COLORS.pink, [-4.9, 3.75, -4.5], 19, 0.57],
        ["</", COLORS.green, [4.95, 3.85, -4.5], -20, 0.57]
      ];

      signs.forEach(function (sign, index) {
        makeFloatingSign(
          sign[0],
          sign[1],
          sign[2],
          sign[3],
          sign[4],
          index
        );
      });
    }

    // ==================================================
    // HUD
    // ==================================================

    function buildHud() {
      const toolbar = document.getElementById("toolbar");
      const status = document.getElementById("status");

      originalDisplay.toolbar = toolbar ? toolbar.style.display : "";
      originalDisplay.status = status ? status.style.display : "";

      if (toolbar) toolbar.style.display = "none";
      if (status) status.style.display = "none";

      hud = document.createElement("div");

      Object.assign(hud.style, {
        position: "fixed",
        top: "18px",
        left: "20px",
        padding: "16px 20px",
        background: "rgba(10, 16, 39, 0.92)",
        border: "1px solid #465076",
        borderRadius: "18px",
        color: "#eff6ff",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        zIndex: "20",
        pointerEvents: "none"
      });

      const title = document.createElement("strong");
      title.textContent = "Programming Lab";
      title.style.color = COLORS.cyan;

      hud.appendChild(title);
      hud.appendChild(
        document.createTextNode(
          " · WASD move · Mouse look · E start · ESC back"
        )
      );

      footer = document.createElement("div");
      footer.textContent = "Press E to start on the keyboard";

      Object.assign(footer.style, {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "14px 20px",
        borderRadius: "25px",
        background: "rgba(12, 16, 42, 0.9)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        textAlign: "center",
        zIndex: "20",
        pointerEvents: "none"
      });

      document.body.appendChild(hud);
      document.body.appendChild(footer);
    }

    function restoreHud() {
      const toolbar = document.getElementById("toolbar");
      const status = document.getElementById("status");

      if (toolbar) {
        toolbar.style.display = originalDisplay.toolbar || "";
      }

      if (status) {
        status.style.display = originalDisplay.status || "";
      }

      if (hud) hud.remove();
      if (footer) footer.remove();

      hud = null;
      footer = null;
    }

    // ==================================================
    // QUESTION DESCRIPTION
    // ==================================================

    function getQuestionDescription(question) {
      if (question.description) {
        return question.description;
      }

      const code = question.code.toLowerCase();

      if (
        code.includes("print(") ||
        code.includes("println(") ||
        code.includes("cout")
      ) {
        return "เลือกคำสั่ง ตัวแปร หรือค่าที่เหมาะสม เพื่อให้โปรแกรมแสดงผลได้ถูกต้อง";
      }

      if (code.includes("for ") || code.includes("for (")) {
        return "เติมส่วนที่ขาดหายไป เพื่อให้คำสั่งวนซ้ำทำงานได้ถูกต้อง";
      }

      if (code.includes("if ") || code.includes("if (")) {
        return "เลือกเงื่อนไขหรือเครื่องหมายที่ถูกต้องสำหรับคำสั่งตรวจสอบเงื่อนไข";
      }

      if (code.includes("return")) {
        return "เติมคำสั่งหรือค่าที่เหมาะสมสำหรับการส่งผลลัพธ์จากฟังก์ชัน";
      }

      if (code.includes("class ")) {
        return "เติมส่วนประกอบของคลาสให้ถูกต้องตามหลักไวยากรณ์ของภาษา";
      }

      if (code.includes("def ") || code.includes("void ")) {
        return "เติมส่วนของการประกาศฟังก์ชันหรือเมธอดให้ถูกต้อง";
      }

      if (
        code.includes("vector") ||
        code.includes("array") ||
        code.includes("list")
      ) {
        return "เลือกคำสั่งที่เหมาะสมสำหรับการจัดการข้อมูลในชุดข้อมูล";
      }

      return "พิจารณาโค้ดที่กำหนด แล้วเลือกคำสั่งหรือค่าที่เหมาะสมมาเติมในช่องว่าง";
    }

    // ==================================================
    // GAME PANEL
    // ==================================================

    function clearGamePanel() {
      dropTarget = null;

      if (gamePanel) {
        clearPanels(gamePanel);
        gamePanel = null;
      }
    }

    function createGamePanel(title) {
      clearGamePanel();

      gamePanel = create("a-entity", {
        position: "0 0 -1.15",
        scale: "1 1 1"
      }, root);

      // Taller background so all controls remain inside.
      panel(gamePanel, {
        text: "",
        position: [0, 2.18, 1.05],
        width: 5,
        height: 4.83,
        background: "#0f1937",
        border: COLORS.purple,
        glow: true
      });

      panel(gamePanel, {
        text: title,
        position: [-0.45, 4.06, 1.1],
        width: 3.25,
        height: 0.44,
        fontSize: 67,
        bold: true,
        color: COLORS.cyan,
        background: "#263352"
      });

      button(
        gamePanel,
        "กลับห้องหลัก",
        [1.82, 4.05, 1.12],
        1.15,
        "home",
        "",
        "#39466a"
      );
    }

    function showLanguages() {
      createGamePanel("เลือกภาษาโปรแกรม");

      Data.languages.forEach(function (language, index) {
        button(
          gamePanel,
          language.label,
          [0, 2.9 - index * 0.68, 1.14],
          2.75,
          "language",
          language.id
        );
      });
    }

    function showDifficulties() {
      createGamePanel("เลือกระดับความยาก");

      Data.difficulties.forEach(function (difficulty, index) {
        button(
          gamePanel,
          difficulty.label,
          [0, 2.9 - index * 0.68, 1.14],
          2.75,
          "difficulty",
          difficulty.id
        );
      });

      button(
        gamePanel,
        "ย้อนกลับ",
        [0, 0.48, 1.15],
        1.6,
        "reset",
        ""
      );
    }

    function showQuestion() {
      createGamePanel("เติมคำตอบลงในช่องว่าง");

      const question = game.getCurrentQuestion();
      const progress = game.getProgress();

      if (!question) return;

      const description = getQuestionDescription(question);

      panel(gamePanel, {
        text:
          "ข้อ " + progress.current + "/" + progress.total +
          "     คะแนน " + progress.score + "/100",
        position: [0, 3.55, 1.14],
        width: 3.5,
        height: 0.36,
        fontSize: 51,
        bold: true,
        color: COLORS.yellow,
        background: "transparent"
      });

      // Thai explanation above the code.
      panel(gamePanel, {
        text: description,
        position: [0, 3.08, 1.15],
        width: 4.35,
        height: 0.51,
        fontSize: 39,
        color: COLORS.white,
        background: "#253354"
      });

      const selectedText = game.selectedAnswer === null
        ? "____"
        : question.options[game.selectedAnswer];

      const displayCode = question.code.replace(
        "____",
        selectedText
      );

      // Drop answers directly onto the code area.
      dropTarget = panel(gamePanel, {
        text: displayCode,
        position: [0, 2.35, 1.17],
        width: 4.35,
        height: 0.88,
        fontSize: 48,
        code: true,
        color: "#e7f7ff",
        background: "#172844",
        border: COLORS.cyan,
        action: "slot"
      });

      if (game.feedback) {
        panel(gamePanel, {
          text: game.feedback.correct
            ? "ถูกต้อง! ได้รับ 10 คะแนน"
            : "ยังไม่ถูก คำตอบคือ " + game.feedback.answer,
          position: [0, 1.35, 1.19],
          width: 4.1,
          height: 0.52,
          fontSize: 48,
          background: game.feedback.correct
            ? "#20584f"
            : "#713d57"
        });

        button(
          gamePanel,
          "ข้อถัดไป",
          [0, 0.48, 1.2],
          2.2,
          "next",
          "",
          "#305f69"
        );

        return;
      }

      question.options.forEach(function (option, index) {
        button(
          gamePanel,
          option,
          [0, 1.55 - index * 0.49, 1.19],
          3.35,
          "option",
          index,
          game.selectedAnswer === index
            ? "#286c70"
            : "#354368"
        );
      });

      button(
        gamePanel,
        "เริ่มใหม่",
        [-1.22, -0.02, 1.2],
        1.55,
        "reset",
        "",
        "#39466a"
      );

      button(
        gamePanel,
        "ตรวจคำตอบ",
        [1.22, -0.02, 1.2],
        1.65,
        "submit",
        "",
        "#305f69"
      );
    }

    function showResult() {
      createGamePanel("สรุปผลการเล่น");

      const result = game.getResult();

      panel(gamePanel, {
        text: result.score + " / " + result.maximum,
        position: [0, 2.65, 1.15],
        width: 3.4,
        height: 0.8,
        fontSize: 135,
        bold: true,
        color: COLORS.yellow,
        background: "#283858",
        border: COLORS.yellow
      });

      panel(gamePanel, {
        text:
          "ตอบถูก " + result.correct +
          " จาก " + result.total + " ข้อ",
        position: [0, 1.65, 1.15],
        width: 3.5,
        height: 0.55,
        fontSize: 64,
        background: "transparent"
      });

      button(
        gamePanel,
        "เล่นใหม่",
        [0, 0.72, 1.15],
        2.1,
        "reset",
        "",
        "#305e68"
      );
    }

    function renderGame() {
      if (!active || !playing) return;

      if (game.status === "language") {
        showLanguages();
      } else if (game.status === "difficulty") {
        showDifficulties();
      } else if (game.status === "question") {
        showQuestion();
      } else if (game.status === "finished") {
        showResult();
      }
    }

    // ==================================================
    // DRAG AND DROP
    // ==================================================

    function removeDragGhost() {
      if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
      }
    }

    function moveDragGhost(event) {
      if (!dragGhost) return;

      dragGhost.style.left = event.clientX + 15 + "px";
      dragGhost.style.top = event.clientY + 15 + "px";
    }

    function beginAnswerDrag(index) {
      if (
        !playing ||
        game.status !== "question" ||
        game.feedback ||
        context.scene.is("vr-mode")
      ) {
        return;
      }

      const question = game.getCurrentQuestion();

      if (!question || !question.options[index]) {
        return;
      }

      dragging = index;
      removeDragGhost();

      dragGhost = document.createElement("div");
      dragGhost.textContent = question.options[index];

      Object.assign(dragGhost.style, {
        position: "fixed",
        left: "0px",
        top: "0px",
        padding: "10px 18px",
        background: "#25395c",
        color: "#ffffff",
        border: "2px solid #83f2e5",
        borderRadius: "10px",
        boxShadow: "0 0 14px #83f2e5",
        fontFamily: "Consolas, monospace",
        fontSize: "18px",
        pointerEvents: "none",
        zIndex: "10000"
      });

      document.body.appendChild(dragGhost);
    }

    function finishAnswerDrag(event) {
      if (dragging === null) return;

      const selected = dragging;
      dragging = null;

      removeDragGhost();

      if (!dropTarget || !context.scene.camera) {
        return;
      }

      const canvas = context.scene.canvas;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, context.scene.camera);

      const targetMesh = dropTarget.getObject3D("mesh");
      if (!targetMesh) return;

      context.scene.object3D.updateMatrixWorld(true);

      const hits = raycaster.intersectObject(targetMesh, true);

      if (hits.length > 0) {
        game.selectAnswer(selected);
        renderGame();
      }
    }

    // ==================================================
    // GAME CONTROL
    // ==================================================

    function startGame() {
      if (!active || playing) return;

      game.reset();
      playing = true;

      if (keyboard) {
        keyboard.classList.remove("selectable");
      }

      if (footer) {
        footer.style.display = "none";
      }

      renderGame();
    }

    function stopGame() {
      playing = false;
      dragging = null;

      removeDragGhost();

      game.reset();
      clearGamePanel();

      if (keyboard) {
        keyboard.classList.add("selectable");
      }

      if (footer) {
        footer.style.display = "";
      }
    }

    function updateSession(oldScore, oldErrors) {
      const session = context.session.get();

      context.session.update({
        score: session.score + game.score - oldScore,
        errors: session.errors + game.errors - oldErrors
      });
    }

    function handleAction(action, value) {
      if (action === "home") {
        context.navigation.goHome();
        return;
      }

      if (action === "start") {
        startGame();
        return;
      }

      if (!playing) return;

      if (action === "language") {
        game.chooseLanguage(value);
      } else if (action === "difficulty") {
        game.chooseDifficulty(value);
      } else if (action === "option") {
        // Click selection also supports VR trigger input.
        game.selectAnswer(Number(value));
      } else if (action === "submit") {
        const oldScore = game.score;
        const oldErrors = game.errors;

        if (game.submit()) {
          updateSession(oldScore, oldErrors);
        }
      } else if (action === "next") {
        game.nextQuestion();
      } else if (action === "reset") {
        game.reset();
      } else if (action === "slot") {
        // The current selected option is shown in the code.
      }

      renderGame();
    }

    function actionTarget(element) {
      if (!root || !element || !element.closest) {
        return null;
      }

      const target = element.closest("[data-action]");

      if (!target || !root.contains(target)) {
        return null;
      }

      return target;
    }

    // ==================================================
    // DESKTOP MOVEMENT
    // ==================================================

    function movePlayer(delta) {
      if (!active || playing || !pressedKeys.size) return;
      if (context.scene.is("vr-mode")) return;

      const cameraElement = document.getElementById("player-camera");
      if (!cameraElement) return;

      const cameraObject = cameraElement.object3D;
      const direction = new THREE.Vector3();

      cameraObject.getWorldDirection(direction);
      direction.y = 0;

      if (direction.lengthSq() === 0) return;

      direction.normalize();

      const right = new THREE.Vector3(
        -direction.z,
        0,
        direction.x
      );

      const movement = new THREE.Vector3();

      if (pressedKeys.has("KeyW")) movement.add(direction);
      if (pressedKeys.has("KeyS")) movement.sub(direction);
      if (pressedKeys.has("KeyD")) movement.add(right);
      if (pressedKeys.has("KeyA")) movement.sub(right);

      if (movement.lengthSq() === 0) return;

      movement.normalize().multiplyScalar(delta * 2.2);
      cameraObject.position.add(movement);

      cameraObject.position.x = THREE.MathUtils.clamp(
        cameraObject.position.x,
        -4.7,
        4.7
      );

      cameraObject.position.z = THREE.MathUtils.clamp(
        cameraObject.position.z,
        -3.8,
        6.1
      );
    }

    function animate(time) {
      if (!active) return;

      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.05)
        : 0;

      lastTime = time;

      movePlayer(delta);

      animationId = requestAnimationFrame(animate);
    }

    // ==================================================
    // EVENTS
    // ==================================================

    function setupEvents() {
      clickHandler = function (event) {
        const target = actionTarget(event.target);

        if (!target) return;

        handleAction(
          target.dataset.action,
          target.dataset.value
        );
      };

      mouseDownHandler = function (event) {
        const target = actionTarget(event.target);

        if (
          target &&
          target.dataset.action === "option"
        ) {
          beginAnswerDrag(Number(target.dataset.value));
        }
      };

      keyDownHandler = function (event) {
        if (!active) return;

        if ([
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD"
        ].includes(event.code)) {
          pressedKeys.add(event.code);
        }

        if (event.code === "KeyE" && !playing) {
          startGame();
          event.preventDefault();
        }

        if (event.code === "Escape") {
          if (playing) {
            stopGame();
          } else {
            context.navigation.goHome();
          }

          event.preventDefault();
        }
      };

      keyUpHandler = function (event) {
        pressedKeys.delete(event.code);
      };

      dragMoveHandler = moveDragGhost;
      dragEndHandler = finishAnswerDrag;

      root.addEventListener("click", clickHandler);
      root.addEventListener("mousedown", mouseDownHandler);

      window.addEventListener("keydown", keyDownHandler);
      window.addEventListener("keyup", keyUpHandler);
      window.addEventListener("mousemove", dragMoveHandler);
      window.addEventListener("mouseup", dragEndHandler);
    }

    function removeEvents() {
      if (root) {
        root.removeEventListener("click", clickHandler);
        root.removeEventListener("mousedown", mouseDownHandler);
      }

      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("mousemove", dragMoveHandler);
      window.removeEventListener("mouseup", dragEndHandler);

      removeDragGhost();

      dragging = null;
      dropTarget = null;
    }

    // ==================================================
    // CLEANUP
    // ==================================================

    function cleanup() {
      removeEvents();

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }

      clearGamePanel();
      restoreHud();

      Array.from(panelResources).forEach(function (element) {
        disposePanel(element);
      });

      panelResources.clear();

      if (root) {
        root.remove();
      }

      root = null;
      workstation = null;
      keyboard = null;
      dropTarget = null;

      active = false;
      playing = false;
      dragging = null;
      lastTime = 0;

      pressedKeys.clear();
      game.reset();
    }

    // ==================================================
    // ROOM LIFECYCLE
    // ==================================================

    return {
      mount: function (container) {
        if (active) return;

        active = true;
        playing = false;

        game.reset();

        root = create("a-entity", {
          id: "programming-lab",
          position: "0 0 0"
        }, container);

        buildEnvironment();
        buildWorkstation();
        buildFloatingSigns();
        buildHud();
        setupEvents();

        context.ui.clearMessage();

        animationId = requestAnimationFrame(animate);

        context.emit("programming:room-ready", {
          title: Data.title
        });
      },

      unmount: function () {
        cleanup();
      }
    };
  };
})();