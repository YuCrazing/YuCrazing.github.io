---
title: "ASCII Art"
---
<input type="file" onchange="previewFile()">

<img src="" height="200" alt="Image preview">

<script type="text/javascript">
	function previewFile(){
		// var preview = $("img"); // Error. 
		var preview = document.querySelector("img");
		var file = document.querySelector("input[type=file]").files[0];
		var reader = new FileReader();

		reader.onloadend = function(){
			preview.src = reader.result;
		}

		if(file){
			reader.readAsDataURL(file);
		}else{
			preview.src = "";
		}
	}
</script>