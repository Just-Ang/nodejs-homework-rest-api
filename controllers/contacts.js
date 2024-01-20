import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HtttpError.js";
import Contact from "../models/contacts.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (favorite) {
    const contacts = await Contact.find(
      { owner, favorite },
      "-cratedAt -updatedAt",
      { skip, limit }
    ).populate("owner", "email subscription");
    res.json(contacts);
  }

  const contacts = await Contact.find({ owner }, "-cratedAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  res.json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete({
    _id: contactId,
    owner: _id,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: _id },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: _id },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
