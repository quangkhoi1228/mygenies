DELETE FROM app_config
WHERE "name" = 'USER_AI_CONFIG_PROCESS';
DELETE FROM user_ai_config;
DELETE FROM user_ai_config_option;


-- APP CONFIG
INSERT INTO app_config
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", description, value, "type")
VALUES('2025-05-15 14:06:14.831', 0, '2025-05-15 16:10:34.698', 0, 'USER_AI_CONFIG_PROCESS', 'USER_AI_CONFIG_PROCESS', '["name","avatar","tone","voice","ability","maxCharacter","maxHintCharacter"]', 'array');

-- AGENT CONFIG
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 01:34:26.050', 0, '2025-06-20 01:43:31.119', 0, 1, 'userAiConfig_name_avatar', 'avatar', 'imageSelect', 1);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 01:57:35.326', 0, '2025-06-20 01:57:35.326', 0, 2, 'userAiConfig_name_name', 'name', 'input', 1);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 01:59:55.434', 0, '2025-06-20 01:59:55.434', 0, 3, 'userAiConfig_name_tone', 'tone', 'multipleChoiceQuestion', 3);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 02:00:16.153', 0, '2025-06-20 02:00:16.153', 0, 4, 'userAiConfig_name_voice', 'voice', 'singleChoiceQuestion', 1);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 02:00:54.893', 0, '2025-06-20 02:00:54.893', 0, 5, 'userAiConfig_name_ability', 'ability', 'multipleChoiceQuestion', 3);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 02:01:16.705', 0, '2025-06-20 02:01:16.705', 0, 6, 'userAiConfig_name_maxCharacter', 'maxCharacter', 'singleChoiceQuestion', 1);
INSERT INTO user_ai_config
("createdAt", "createdUser", "updatedAt", "updatedUser", id, "name", "key", "type", "maxSelection")
VALUES('2025-06-20 02:01:26.987', 0, '2025-06-20 02:01:26.987', 0, 7, 'userAiConfig_name_maxHintCharacter', 'maxHintCharacter', 'singleChoiceQuestion', 1);

-- AGENT CONFIG OPTIONS
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:16:53.228', 0, '2025-06-20 02:16:53.228', 0, 'userAiConfigOption_name_ability_4', 'userAiConfigOption_value_ability_4', 'userAiConfigOption_url_ability_4', 5, 'ability');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:16:34.907', 0, '2025-06-20 02:16:34.907', 0, 'userAiConfigOption_name_ability_1', 'userAiConfigOption_value_ability_1', 'userAiConfigOption_url_ability_1', 5, 'ability');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:16:45.416', 0, '2025-06-20 02:16:45.416', 0, 'userAiConfigOption_name_ability_2', 'userAiConfigOption_value_ability_2', 'userAiConfigOption_url_ability_2', 5, 'ability');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:16:53.228', 0, '2025-06-20 02:16:53.228', 0, 'userAiConfigOption_name_ability_3', 'userAiConfigOption_value_ability_3', 'userAiConfigOption_url_ability_3', 5, 'ability');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:16:53.228', 0, '2025-06-20 02:16:53.228', 0, 'userAiConfigOption_name_ability_5', 'userAiConfigOption_value_ability_5', 'userAiConfigOption_url_ability_5', 5, 'ability');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:08:23.635', 0, '2025-06-20 02:08:23.635', 0, 'userAiConfigOption_name_avatar_1', 'userAiConfigOption_value_avatar_1', 'userAiConfigOption_url_avatar_1', 1, 'avatar');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:08:23.635', 0, '2025-06-20 02:08:23.635', 0, 'userAiConfigOption_name_avatar_2', 'userAiConfigOption_value_avatar_2', 'userAiConfigOption_url_avatar_2', 1, 'avatar');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:08:23.635', 0, '2025-06-20 02:08:23.635', 0, 'userAiConfigOption_name_avatar_3', 'userAiConfigOption_value_avatar_3', 'userAiConfigOption_url_avatar_3', 1, 'avatar');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:08:23.635', 0, '2025-06-20 02:08:23.635', 0, 'userAiConfigOption_name_avatar_4', 'userAiConfigOption_value_avatar_4', 'userAiConfigOption_url_avatar_4', 1, 'avatar');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:08:23.635', 0, '2025-06-20 02:08:23.635', 0, 'userAiConfigOption_name_avatar_5', 'userAiConfigOption_value_avatar_5', 'userAiConfigOption_url_avatar_5', 1, 'avatar');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:17:13.654', 0, '2025-06-20 02:17:13.654', 0, 'userAiConfigOption_name_maxCharacter_1', 'userAiConfigOption_value_maxCharacter_1', 'userAiConfigOption_url_maxCharacter_1', 6, 'maxCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:17:23.573', 0, '2025-06-20 02:17:23.573', 0, 'userAiConfigOption_name_maxCharacter_2', 'userAiConfigOption_value_maxCharacter_2', 'userAiConfigOption_url_maxCharacter_2', 6, 'maxCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:17:28.688', 0, '2025-06-20 02:17:28.688', 0, 'userAiConfigOption_name_maxCharacter_3', 'userAiConfigOption_value_maxCharacter_3', 'userAiConfigOption_url_maxCharacter_3', 6, 'maxCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:17:59.756', 0, '2025-06-20 02:17:59.756', 0, 'userAiConfigOption_name_maxHintCharacter_1', 'userAiConfigOption_value_maxHintCharacter_1', 'userAiConfigOption_url_maxHintCharacter_1', 7, 'maxHintCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:18:05.040', 0, '2025-06-20 02:18:05.040', 0, 'userAiConfigOption_name_maxHintCharacter_2', 'userAiConfigOption_value_maxHintCharacter_2', 'userAiConfigOption_url_maxHintCharacter_2', 7, 'maxHintCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:18:10.302', 0, '2025-06-20 02:18:10.302', 0, 'userAiConfigOption_name_maxHintCharacter_3', 'userAiConfigOption_value_maxHintCharacter_3', 'userAiConfigOption_url_maxHintCharacter_3', 7, 'maxHintCharacter');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:11:35.208', 0, '2025-06-20 02:11:35.208', 0, 'userAiConfigOption_name_tone_1', 'userAiConfigOption_value_tone_1', 'userAiConfigOption_url_tone_1', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:12:00.978', 0, '2025-06-20 02:12:00.978', 0, 'userAiConfigOption_name_tone_2', 'userAiConfigOption_value_tone_2', 'userAiConfigOption_url_tone_2', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:12:06.722', 0, '2025-06-20 02:12:06.722', 0, 'userAiConfigOption_name_tone_3', 'userAiConfigOption_value_tone_3', 'userAiConfigOption_url_tone_3', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:12:12.843', 0, '2025-06-20 02:12:12.843', 0, 'userAiConfigOption_name_tone_4', 'userAiConfigOption_value_tone_4', 'userAiConfigOption_url_tone_4', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:12:12.843', 0, '2025-06-20 02:12:12.843', 0, 'userAiConfigOption_name_tone_5', 'userAiConfigOption_value_tone_5', 'userAiConfigOption_url_tone_5', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:12:12.843', 0, '2025-06-20 02:12:12.843', 0, 'userAiConfigOption_name_tone_6', 'userAiConfigOption_value_tone_6', 'userAiConfigOption_url_tone_6', 3, 'tone');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:39.769', 0, '2025-06-20 02:15:39.769', 0, 'userAiConfigOption_name_voice_1', 'userAiConfigOption_value_voice_1', 'userAiConfigOption_url_voice_1', 4, 'voice');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:47.627', 0, '2025-06-20 02:15:47.627', 0, 'userAiConfigOption_name_voice_2', 'userAiConfigOption_value_voice_2', 'userAiConfigOption_url_voice_2', 4, 'voice');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:53.461', 0, '2025-06-20 02:15:53.461', 0, 'userAiConfigOption_name_voice_3', 'userAiConfigOption_value_voice_3', 'userAiConfigOption_url_voice_3', 4, 'voice');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:53.461', 0, '2025-06-20 02:15:53.461', 0, 'userAiConfigOption_name_voice_4', 'userAiConfigOption_value_voice_4', 'userAiConfigOption_url_voice_4', 4, 'voice');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:53.461', 0, '2025-06-20 02:15:53.461', 0, 'userAiConfigOption_name_voice_5', 'userAiConfigOption_value_voice_5', 'userAiConfigOption_url_voice_5', 4, 'voice');
INSERT INTO user_ai_config_option
("createdAt", "createdUser", "updatedAt", "updatedUser", "name", value, url, "configId", "configKey")
VALUES('2025-06-20 02:15:53.461', 0, '2025-06-20 02:15:53.461', 0, 'userAiConfigOption_name_voice_6', 'userAiConfigOption_value_voice_6', 'userAiConfigOption_url_voice_6', 4, 'voice');