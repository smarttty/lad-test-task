1. Опишу условия фильтрации и подсчета, которые я реализовал:
 - Active - те, у которых blocked = false и deleted = false
 - Admins - те, у которых admin = true (то есть и заблокированные и удаленные)
 - Blocked - те, у которых blocked = true и deleted = false
 - Deleted - те, у которых deleted = true

2. SVG иконка редактирования пользователя для шрифта нарисована не совсем корректно, поэтому отображается немного неверно. 

3. Не настроено реверс - проксирование бэкенда через nginx, поэтому CORS заголовки - wildcard.

4. Не реализован loader. 

5. Не сделаны чекбоксы в таблице (функционал в задаче не требует чекбоксов)

6. Токен хранится в куки, httpOnly, живет - 1 час. 

7. Инструкция по запуску:
 - В папке - docker-compose файл. Он занимает порты 8080, 8090 хостовой машины (фронт, бэк)
 - docker compose up -d (Сборка образа бэкенда, старт 3х контейнер)
 - Миграция БД реализована через DRF, дополнено данными
 - У всех пользователей пароль - 12345
 - После успешно старта контейнеров - переход на http://localhost:8080, логин, переход на список
 - Можно залогиниться под valeri79@example.net/12345 или любым другим пользователем
 - Фильтрация, пагинация, сортировка, удаления по клику на кнопку в строке, обновление списка. 

8. Если будут вопросы или не запустится что-нибудь - напишите мне. Собирал в ночи, мог что то потерять. 