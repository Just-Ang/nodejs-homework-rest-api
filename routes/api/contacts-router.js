import express from "express";
import contactsController from "../../controllers/contacts.js";
import isValidId from "../../middlewars/isValidId.js";
import validateBody from "../../decorators/validateBody.js";
import contactsSchema from "../../schemas/contacts-schema.js";
import authenticate from "../../middlewars/authenticate.js";

const router = express.Router();
router.use(authenticate);

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", contactsController.addContact);

router.delete("/:contactId", contactsController.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(contactsSchema.contactsAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(contactsSchema.contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);

export default router;
