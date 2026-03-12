【入力ルール】

1. 1行 = 1装備
2. id は変更しない
3. 複数値は必ず | 区切り
4. job_tags は次の表記のみ使用
   ソードマン|マジシャン|アーチャー|アコライト|シーフ|マーチャント|ドラム
5. detail_tags は tag_dict の tag_label と一致させる
6. genre_names は genre_dict の genre_name_jp と一致させる
7. status_text_core は改行可
8. 不明なことは notes に書く
9. status は published / draft / archived のみ
10. equip_slot と genre_bucket はプルダウン推奨

【AI変換ルール】
- genre_names を | で分割して equipment_genre_members に変換
- job_tags を | で分割して equipment_item_tags に変換
- detail_tags を | で分割して equipment_item_tags に変換
- tag_label -> tag_key は tag_dict を参照
- genre_name_jp は genre_dict を参照
