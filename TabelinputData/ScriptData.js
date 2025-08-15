$(document).ready(function () {
  const $form = $("#dataForm");
  const $inputs = $form.find("input");
  const $tableBody = $("#dataTable tbody");
  const $resetAllBtn = $("#resetAllBtn");
  const $modal = $("#alertModal");
  const $resetModal = $("#resetModal");
  const $modalText = $("#modalText");

  let nomorUrut = 1;
  let rowBeingEdited = null;
  let savedData = JSON.parse(localStorage.getItem("dataUsers")) || [];

  if (savedData.length > 0) {
    savedData.forEach(item => tambahBarisDariStorage(item));
  }

  function showModal(message) {
    $modalText.text(message);
    $modal.addClass("show");
  }

  $("#closeModal").click(() => $modal.removeClass("show"));
  $("#cancelReset").click(() => $resetModal.removeClass("show"));

  $inputs.on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const index = $inputs.index(this);
      const nextInput = $inputs.eq(index + 1);

      if (nextInput.length) {
        nextInput.focus();
      } else {
        const allFilled = $inputs.toArray().every(input => $(input).val().trim() !== "");
        allFilled ? $form.submit() : showModal("Isi semua data yaa!");
      }
    }
  });

  $form.on("submit", function (e) {
    e.preventDefault();

    const nama = $("#nama").val().trim();
    const usia = $("#usia").val().trim();
    const berat = $("#berat").val().trim();
    const tinggi = $("#tinggi").val().trim();

    if (!nama || !usia || !berat || !tinggi) {
      return showModal("Isi semua data yaa!");
    }

    const dataItem = { nama, usia, berat, tinggi };

    if (rowBeingEdited) {
      const index = parseInt(rowBeingEdited.data("index"));
      savedData[index] = dataItem;
      rowBeingEdited = null;
    } else {
      savedData.push(dataItem);
    }

    localStorage.setItem("dataUsers", JSON.stringify(savedData));
    updateTableFromStorage();
    $form[0].reset();
    $inputs.eq(0).focus();
  });

  $resetAllBtn.on("click", function () {
    if (savedData.length > 0) {
      $resetModal.addClass("show");
    }
  });

  $("#confirmReset").on("click", function () {
    savedData = [];
    updateTableFromStorage();
    localStorage.removeItem("dataUsers");
    $resetModal.removeClass("show");
  });

  function tambahBarisDariStorage(item) {
    const index = savedData.indexOf(item);

    const row = `
      <tr data-index="${index}">
        <td>${nomorUrut}</td>
        <td>${item.nama}</td>
        <td>${item.usia}</td>
        <td>${item.berat}</td>
        <td>${item.tinggi}</td>
        <td>
          <button class="edit-button" onclick="editData(this)">Edit</button>
          <button class="delete-button" onclick="hapusBaris(this)">Batalkan</button>
        </td>
      </tr>
    `;

    $tableBody.append(row);
    nomorUrut++;
  }

  function updateTableFromStorage() {
    $tableBody.empty();
    nomorUrut = 1;
    savedData.forEach(item => tambahBarisDariStorage(item));
  }

  window.editData = function (btn) {
    const $row = $(btn).closest("tr");
    const index = parseInt($row.data("index"));
    const item = savedData[index];

    $("#nama").val(item.nama);
    $("#usia").val(item.usia);
    $("#berat").val(item.berat);
    $("#tinggi").val(item.tinggi);

    rowBeingEdited = $row;
  };

  window.hapusBaris = function (btn) {
    const $row = $(btn).closest("tr");
    const index = parseInt($row.data("index"));

    savedData.splice(index, 1);
    localStorage.setItem("dataUsers", JSON.stringify(savedData));

    updateTableFromStorage();

    if (rowBeingEdited && rowBeingEdited.is($row)) {
      rowBeingEdited = null;
      $form[0].reset();
    }
  };
});