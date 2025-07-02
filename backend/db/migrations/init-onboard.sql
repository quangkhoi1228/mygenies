-- DELETE
DELETE FROM app_config
WHERE "name"='ONBOARD_PHASE_PROCESS';
DELETE FROM onboard_phase;

-- APP CONFIG
INSERT INTO app_config
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", description, value, "type")
VALUES('2025-05-15 14:06:14.831', 0, '2025-05-15 16:10:34.698', 0, 'ONBOARD_PHASE_PROCESS', 'ONBOARD_PHASE_PROCESS', '[{"steps":[{"code":"onboardBegin","type":"view"},{"code":"languageLevel","type":""},{"code":"learningHistory","type":""},{"code":"areaOfExpertise","type":""},{"code":"onboardInitEnd","type":"view"}]},{"steps":[{"code":"languageLearningFrequency","type":""}]}]', 'array');

-- ONBOARD QUESTION
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:04:25.815', 0, '2025-05-16 00:04:25.815', 0, 'nativeLanguage', 'onboard_nativeLanguage_title', '', '{"type": "singleChoiceQuestion", "options": [{"text": "English", "image": "", "value": "en"}, {"text": "Vietnamese", "image": "", "value": "vi"}]}'::jsonb, 'question', 1);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:04:37.187', 0, '2025-05-16 00:04:37.187', 0, 'languageToLearn', 'onboard_languageToLearn_title', '', '{"type": "singleChoiceQuestion", "options": [{"text": "English", "image": "", "value": "en"}, {"text": "Vietnamese", "image": "", "value": "vi"}]}'::jsonb, 'question', 2);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:10:23.065', 0, '2025-05-16 00:10:23.065', 0, 'learningHistory', 'onboard_learningHistory_title', '', '{"type": "multipleChoiceQuestion", "options": [{"text": "learningHistory_school", "image": "", "value": "learningHistory_school"}, {"text": "learningHistory_university", "image": "", "value": "learningHistory_university"}, {"text": "learningHistory_englishCenter", "image": "", "value": "learningHistory_englishCenter"}, {"text": "learningHistory_tutor", "image": "", "value": "learningHistory_tutor"}, {"text": "learningHistory_selfEducated", "image": "", "value": "learningHistory_selfEducated"}, {"text": "learningHistory_livingAbroad", "image": "", "value": "learningHistory_livingAbroad"}, {"text": "learningHistory_other", "image": "", "value": "", "isOptional": true}]}'::jsonb, 'question', 4);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:09:01.515', 0, '2025-05-16 00:09:01.515', 0, 'languageLevel', 'onboard_languageLevel_title', '', '{"type": "singleChoiceQuestion", "options": [{"text": "languageLevel_0", "image": "", "value": 0}, {"text": "languageLevel_1", "image": "", "value": 1}, {"text": "languageLevel_2", "image": "", "value": 2}, {"text": "languageLevel_3", "image": "", "value": 3}, {"text": "languageLevel_4", "image": "", "value": 4}, {"text": "languageLevel_5", "image": "", "value": 5}]}'::jsonb, 'question', 3);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:13:08.481', 0, '2025-05-16 00:13:08.481', 0, 'learningPurpose', 'onboard_learningPurpose_title', '', '{"type": "multipleChoiceQuestion", "options": [{"text": "learningPurpose_careerGrowth", "image": "", "value": "learningPurpose_careerGrowth"}, {"text": "learningPurpose_travel", "image": "", "value": "learningPurpose_travel"}, {"text": "learningPurpose_studyAbroad", "image": "", "value": "learningPurpose_studyAbroad"}, {"text": "learningPurpose_livingAbroad", "image": "", "value": "learningPurpose_livingAbroad"}, {"text": "learningPurpose_personalImprovement", "image": "", "value": "learningPurpose_personalImprovement"}, {"text": "learningPurpose_entertainment", "image": "", "value": "learningPurpose_entertainment"}, {"text": "learningPurpose_other", "image": "", "value": "", "isOptional": true}]}'::jsonb, 'question', 5);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:17:04.552', 0, '2025-05-16 00:17:04.552', 0, 'languageLearningFrequency', 'onboard_languageLearningFrequency_title', '', '{"type": "singleChoiceQuestion", "options": [{"text": "languageLearningFrequency_1", "image": "", "value": 5}, {"text": "languageLearningFrequency_2", "image": "", "value": 10}, {"text": "languageLearningFrequency_3", "image": "", "value": 15}, {"text": "languageLearningFrequency_4", "image": "", "value": 30}, {"text": "languageLearningFrequency_5", "image": "", "value": 40}, {"text": "languageLearningFrequency_6", "image": "", "value": 60}]}'::jsonb, 'questionWithChart', 7);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:02:48.651', 0, '2025-05-16 00:02:48.651', 0, 'onboardBegin', 'onboard_onboardBegin_title', 'onboard_onboardBegin_description', '{"type": "static", "options": [{"text": "", "image": "", "value": "", "defaultSelected": false}]}'::jsonb, 'landingPage', 0);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-05-16 00:13:21.628', 0, '2025-05-16 00:13:21.628', 0, 'onboardInitEnd', 'onboard_onboardInitEnd_title', 'onboard_onboardInitEnd_description', '{"type": "static", "options": [{"text": "", "image": "", "value": ""}]}'::jsonb, 'landingPage', 6);
INSERT INTO onboard_phase
("createdAt", "createdUser", "updatedAt", "updatedUser", code, title, description, "content", "template", "order")
VALUES('2025-06-24 16:57:33.298', 0, '2025-06-24 16:57:33.298', 0, 'areaOfExpertise', 'onboard_areaOfExpertise_title', '', '{"type": "multipleChoiceQuestion", "options": [{"text": "areaOfExpertise_student", "image": "", "value": "areaOfExpertise_student"}, {"text": "areaOfExpertise_programmer", "image": "", "value": "areaOfExpertise_programmer"}, {"text": "areaOfExpertise_marketing", "image": "", "value": "areaOfExpertise_marketing"}, {"text": "areaOfExpertise_medical", "image": "", "value": "areaOfExpertise_medical"}, {"text": "areaOfExpertise_hr", "image": "", "value": "areaOfExpertise_hr"}, {"text": "areaOfExpertise_other", "image": "", "value": "", "isOptional": true}]}'::jsonb, 'question', 5);

