$(document).ready(function () {
    let editIndex = null;

    function loadJadwal() {
        $("#jadwal-list").empty();
        let data = localStorage.getItem("jadwal");
        if (data) {
            let jadwal = JSON.parse(data);
            jadwal.sort((a, b) => a.jam.localeCompare(b.jam));
            jadwal.forEach(item => addRow(item.jam, item.kegiatan));
        }
    }

    function saveJadwal() {
        let jadwal = [];
        $("#jadwal-list tr").each(function () {
            let jam = $(this).find("td:eq(0)").text();
            let kegiatan = $(this).find("td:eq(1)").text();
            jadwal.push({ jam, kegiatan });
        });
        jadwal.sort((a, b) => a.jam.localeCompare(b.jam));
        localStorage.setItem("jadwal", JSON.stringify(jadwal));
    }

    function addRow(jam, kegiatan) {
        let row = `<tr>
            <td class="jam-cell">${jam}</td>
            <td>${kegiatan}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Hapus</button>
            </td>
        </tr>`;
        $("#jadwal-list").append(row);
    }

    function tambahJadwal() {
        let jam = $("#waktu").val();
        let kegiatan = $("#kegiatan").val().trim();
        if (!jam || !kegiatan) { alert("Isi jam dan kegiatan dulu ya!"); return; }
        addRow(jam, kegiatan);
        saveJadwal();
        loadJadwal();
        $("#waktu").val("").focus();
        $("#kegiatan").val("");
    }

    $("#tambah").click(tambahJadwal);

    $("#waktu, #kegiatan").keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $("#simpan").is(":visible") ? $("#simpan").click() : tambahJadwal();
        }
    });

    $(document).on("click", ".delete-btn", function () {
        $(this).closest("tr").remove();
        saveJadwal();
    });

    $(document).on("click", ".edit-btn", function () {
        let row = $(this).closest("tr");
        editIndex = row.index();
        $("#waktu").val(row.find("td:eq(0)").text());
        $("#kegiatan").val(row.find("td:eq(1)").text());
        $("#tambah").hide(); $("#simpan").show();
    });

    $("#simpan").click(function () {
        let jam = $("#waktu").val();
        let kegiatan = $("#kegiatan").val().trim();
        if (!jam || !kegiatan) { alert("Isi jam dan kegiatan dulu ya!"); return; }
        let row = $("#jadwal-list tr").eq(editIndex);
        row.find("td:eq(0)").text(jam);
        row.find("td:eq(1)").text(kegiatan);
        saveJadwal(); loadJadwal();
        $("#waktu").val("").focus(); $("#kegiatan").val("");
        $("#tambah").show(); $("#simpan").hide(); editIndex = null;
    });

    $("#reset").click(function () { $("#resetModal").addClass("show"); });
    $("#cancelReset").click(function () { $("#resetModal").removeClass("show"); });
    $("#confirmReset").click(function () {
        $("#jadwal-list").empty();
        localStorage.removeItem("jadwal");
        $("#resetModal").removeClass("show");
    });

    $(window).on("load", function () { window.scrollTo(0, 0); $("#waktu").focus(); });

    loadJadwal();
});