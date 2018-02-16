$(function () {

    $(document).ready(function () {
        $('.modal').modal();
    });

    $("#scrape").on("click", function () {
        $.ajax("/api/scrape", {
            type: "GET"
        }).done(function (response) {
            console.log(response);
            $('#modal1').modal("open");
            $("#ArticleLen").html(`${response} New articles were added!`);
            setInterval(function () {
                window.location.href = "/";
            }, 5000);
        })
    });
    $(document).on("click", "#save", function () {
        const id = $(this).attr("data-id");

        $.ajax("/save/article/" + id, {
            type: "GET"
        }).done(function (result) {
            console.log(result);
        })
    });
    $(document).on("click", "#note", function () {
        const id = $(this).attr("data-id");

        $('#modal2').modal("open");
        $("#noteId").html(`Notes For Article: ${id}`);
        $("#saveNote").attr("data-id", id);
        $.ajax("/note/" + id, {
            type: "GET"
        }).done(function (response) {
            $("#notes").html("")
            response.forEach(element => {
                console.log(element.id)
                $("#notes").append("<div>" + element.body + "<a noteid='" + element.id + "'class='btn right red' id='delete-note'>X</a>" + "</div><br>")
            });
        })
    });
    $(document).on("click", "#delete-note", function () {
        const id = $(this).attr("noteid");
       console.log(id)
        $.ajax("/note/delete/" + id, {
            type: "PUT"
        }).done(function(response){
           // location.reload();
           console.log(response);
        })
    })

    $(document).on("click", "#delete", function () {
        const id = $("#note").attr("data-id");
        $.ajax("/article/delete/" + id, {
            type: 'PUT'
        }).done(function (response) {
            window.location.href = "/saved";
            console.log("delete")
        })
    })

    $(document).on("click", "#saveNote", function () {
        const id = $(this).attr("data-id");
        const body = $("#newNote").val().trim();
        //console.log(id);

        const obj = {
            body: body
        }
        $.ajax("/note/create/" + id, {
            type: "POST",
            data: obj
        }).done(function (response) {
            console.log(response)
        })
    })
});
