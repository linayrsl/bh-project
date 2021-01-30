import {FamilyTree} from "./contracts/familyTree";
import {i18n} from "./i18n";
import {PersonNode} from "./contracts/personNode";

export const createPersonDetails = () => ({
  image: null,
  firstName: null,
  lastName: null,
  maidenName: null,
  gender: null,
  birthDate: null,
  birthPlace: null,
  isAlive: true,
  deathDate: null,
  deathPlace: null,
})

const createLevel3Person = (): PersonNode => ({
  ...createPersonDetails(),
  isSubmitter: false,
  mother: createLevel4Person(),
  father: createLevel4Person(),
  siblings: null,
});

const createLevel4Person = (): PersonNode => ({
  ...createPersonDetails(),
  isSubmitter: false,
  mother: null,
  father: null,
  siblings: null,
});

export const loadOrCreateTree = (): FamilyTree => {
  const familyTree = localStorage.getItem("familyTree");

  if (familyTree) {
    return JSON.parse(familyTree);
  }

  return {
    language: i18n.language,
    submitter: {
      ...createPersonDetails(),
      isSubmitter: true,
      mother: {
        ...createPersonDetails(),
        isSubmitter: false,
        mother: createLevel3Person(),
        father: createLevel3Person(),
        siblings: []
      },
      father: {
        ...createPersonDetails(),
        isSubmitter: false,
        mother: createLevel3Person(),
        father: createLevel3Person(),
        siblings: []
      },
      siblings: [],
      coParents: [],
    },
    submitterEmail: window.localStorage.getItem("submitterEmail") || "",
  };
};

export const saveTree = (familyTree: FamilyTree) => {
  localStorage.setItem("familyTree", JSON.stringify(familyTree));
}
