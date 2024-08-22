// Refactored Event Listener function to run folders & files

const deleteModal = function () {
  const deleteModal = document.getElementById("delete-modal");
  if (deleteModal) {
    console.log("Applying delete listeners");
    deleteModal.addEventListener("show.bs.modal", async function (event) {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const id = button.getAttribute("data-bs-whomever");
      const type = button.getAttribute("id");
      const modalParent = button.getAttribute("data-bs-parent");
      // Update the modal's content.
      const modalTitle = deleteModal.querySelector(".modal-title");
      const modalFormId = deleteModal.querySelector(".modal-id");
      const modalFormParent = deleteModal.querySelector(".modal-parent");
      const modalMessage = deleteModal.querySelector(".modal-message");
      const deleteForm = deleteModal.querySelector(".delete-form");

      console.log(deleteForm);

      modalTitle.textContent =
        type == "delete-folder" ? `Delete Folder` : "Delete File";
      modalFormId.setAttribute("value", id);
      modalFormParent.setAttribute("value", modalParent);
      console.log(modalFormParent);
      modalMessage.textContent =
        type == "delete-folder"
          ? "Are you sure you want to delete this folder and all of it's contents?"
          : "Are you sure you want to delete this file?";
      deleteForm.setAttribute(
        "action",
        type == "delete-folder" ? "/drive/delete/folder" : "/drive/delete/file"
      );
    });
  }
};

const updateModal = function () {
  const updateModal = document.getElementById("update-modal");
  if (updateModal) {
    console.log("Applying update listeners");
    updateModal.addEventListener("show.bs.modal", async function (event) {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const id = button.getAttribute("data-bs-whomever");
      const type = button.getAttribute("id");
      const modalParent = button.getAttribute("data-bs-parent");
      const modalValue = button.getAttribute("data-bs-current");
      // Update the modal's content.
      const modalTitle = updateModal.querySelector(".modal-title");
      const modalFormId = updateModal.querySelector(".modal-id");
      const modalFormParent = updateModal.querySelector(".modal-parent");
      const modalFormValue = updateModal.querySelector(".modal-value");
      const modalMessage = updateModal.querySelector(".modal-message");
      const updateForm = updateModal.querySelector(".update-form");

      console.log(updateForm);

      modalTitle.textContent =
        type == "update-folder" ? `Rename Folder` : "Rename File";
      modalFormId.setAttribute("value", id);
      modalFormParent.setAttribute("value", modalParent);
      modalFormValue.setAttribute("value", modalValue);
      modalMessage.textContent =
        type == "update-folder"
          ? "Rename to your hearts content"
          : "Rename file (but don't change the file type!)";
      updateForm.setAttribute(
        "action",
        type == "update-folder" ? "/drive/update/folder" : "/drive/update/file"
      );
    });
  }
};

const fileLinkModal = function () {
  const fileLinkModal = document.getElementById("file-link-modal");
  console.log(fileLinkModal);
  if (fileLinkModal) {
    console.log("Applying file event listeners:");
    fileLinkModal.addEventListener("show.bs.modal", async function (event) {
      const button = event.relatedTarget;
      const id = button.getAttribute("data-bs-whomever");
      const href = button.getAttribute("data-bs-href");
      console.log(id);
      console.log(href);
      console.log("this");
      const modalImage = fileLinkModal.querySelector(".modal-image");
      const modalLink = fileLinkModal.querySelector(".modal-link");

      modalImage.setAttribute("src", href);
      modalLink.setAttribute("value", href);
      modalLink.textContent = href;
    });
  }
};

fileLinkModal();
updateModal();
deleteModal();
